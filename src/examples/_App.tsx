import React from "react";
import { Condition, Controller, FormController, Input, Submit } from "..";

type MyForm = {
  name: string;
  password: string;
  counter: string;
};

export function App() {
  const [state, setState] = React.useState(0);

  return (
    <>
      <div>state: {state}</div>
      <div>
        <button type="button" onClick={() => setState(state + 1)}>
          Increase state
        </button>
      </div>
      <FormController<MyForm>
        onSubmit={(fields) => console.log(fields)}
        validateOnChange
      >
        {(controller) => {
          return (
            <>
              <div>
                <label htmlFor="aaaa">Label</label>
                <Input
                  id="aaaa"
                  controller={controller}
                  name="name"
                  validate={(a) =>
                    a !== undefined && a.trim() !== "" ? null : "Error"
                  }
                  type="number"
                />
              </div>
              <div>
                <Input
                  Component={MockedInput1}
                  disableIf={(fields) =>
                    !fields.name || fields.name?.trim() === ""
                  }
                  controller={controller}
                  name="counter"
                  validate={(a) => parseInt(a || "") !== 0 && "Error"}
                />
              </div>
              <div>
                <Input
                  Component={MockedInput2}
                  disableIf={(fields) =>
                    !fields.name || fields.name?.trim() === ""
                  }
                  abcd="a"
                  controller={controller}
                  name="counter"
                  validate={(a) => parseInt(a || "") !== 0 && "Error"}
                />
              </div>
              <div>
                <Condition controller={controller} ifFormValid={true}>
                  Ahoj
                </Condition>
              </div>
              <Submit
                controller={controller}
                ButtonComponent={MockedButton2}
                abcd=""
              >
                Submit
              </Submit>
              <button type="button" onClick={() => controller.resetForm()}>
                Reset
              </button>
            </>
          );
        }}
      </FormController>
    </>
  );
}

const MockedButton1 = ({}: {}) => {
  return <button>ab</button>;
};

const MockedInput1: React.ComponentType<{
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> = (props) => {
  return <input />;
};

class MockedInput2 extends React.Component<{
  abcd: string;
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> {
  render() {
    return (
      <input
        disabled={this.props.disabled}
        onChange={this.props.onChange}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }
}

class MockedButton2 extends React.Component<{
  abcd: string;
  disabled: boolean;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<Controller<MyForm>>;
}> {
  render() {
    return <button>ab</button>;
  }
}

// ////////

// type FnStrongTypedOrNever<
//   T extends (arg: any) => any,
//   TConstraint extends any[]
// > = [...Parameters<T>, ReturnType<T>] extends TConstraint ? T : never;

// function functionA<T extends (arg: any) => any>(
//   call: FnStrongTypedOrNever<T, [string, boolean]>
// ) {
//   call("");
// }

// function functionB() {
//   return true;
// }

// function functionD(name: string) {
//   return true;
// }

// function functionC() {
//   functionA(functionD); // this doesn't throw a syntax error
//   functionA(functionB); // this throws a syntax error
//   functionB(""); // this throws a syntax error
// }

// //////

// type ConstrainedFunction<
//   TFun extends (...args: any[]) => any,
//   TConstraint extends (...args: any[]) => any
// > = Parameters<TFun>["length"] extends Parameters<TConstraint>["length"]
//   ? TFun
//   : TConstraint & "";

// function test<T extends (name: string) => boolean>(
//   call: ConstrainedFunction<T, (name: string) => boolean>
// ): void {
//   call("");
// }

// function functionArgumentOverflow(first: string, second: string) {
//   return true;
// }

// function functionTypeMismatch(numeric: number) {
//   return true;
// }

// function functionEmpty() {
//   return true;
// }

// function functionOk(name: string) {
//   return true;
// }

// test(functionOk);
// // this doesn't throw a syntax error

// test(functionArgumentOverflow);
// // Type 'StrongTypedFunction<(first: string, second: string) => boolean>'
// // is not assignable to type '(name: string) => boolean'.

// test(functionTypeMismatch);
// // Type 'string' is not assignable to type 'number'.

// test(functionEmpty);
// // Argument of type '() => boolean'
// // is not assignable to parameter of type '((name: string) => boolean) & ""'

// functionEmpty("");
// // this throws a syntax error
