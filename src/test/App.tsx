import React from "react";
import { Condition, FormController, Input, Submit } from "../";

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
                  InputComponent={MockedInput1}
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
                  InputComponent={MockedInput2}
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
      {/* <Ne Component={<MockedInput abcd="el1" />} />
      <Ne Component={MockedInput} />
      <Ne Component="a" />
      <Ne Component={a} />
      <Ne Component={<MockedInput2 abc="el3" />} />
      <Ne Component={MockedInput2} /> */}
    </>
  );
}

const MockedButton1 = ({}: {}) => {
  return <button>ab</button>;
};

const MockedInput1: React.ComponentType<{
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> = (props) => {
  return <input />;
};

class MockedInput2 extends React.Component<{
  abcd: string;
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
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> {
  render() {
    return <button>ab</button>;
  }
}

function FunctionA<T extends (name: string) => boolean>(call: T) {
  call("");
}

function functionB() {
  return true;
}

function functionC() {
  FunctionA(functionB);
  //functionB("");
}
