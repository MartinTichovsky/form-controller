import React from "react";
import { Condition, FormController, Input, Submit } from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalInputComponent = ({
  disabled,
  onChange,
  onKeyDown
}: {
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <span>
      <label htmlFor="f-input" style={{ marginRight: 10 }}>
        Functional Component
      </label>
      <input
        disabled={disabled}
        id="f-input"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Input a given name"
      />
    </span>
  );
};

class ClassInputComponent extends React.Component<{
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> {
  render() {
    return (
      <span>
        <label htmlFor="c-input" style={{ marginRight: 10 }}>
          Class Component
        </label>
        <input
          disabled={this.props.disabled}
          id="c-input"
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          placeholder="Input a surname"
        />
      </span>
    );
  }
}

export const ComponentInput = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <div>
        <button type="button" onClick={() => setCounter(counter + 1)}>
          Re-Render Form: {counter}
        </button>
      </div>
      <FormController<MyForm>
        onSubmit={(fields) => console.log(fields)}
        style={{ marginTop: 15 }}
      >
        {(controller) => {
          return (
            <>
              <FormRow>
                <Input
                  controller={controller}
                  InputComponent={FunctionalInputComponent}
                  name="givenName"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid given name"
                  }
                />
              </FormRow>
              <FormRow>
                <Input
                  controller={controller}
                  InputComponent={ClassInputComponent}
                  name="surname"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid surname"
                  }
                />
              </FormRow>
              <Condition controller={controller} ifFormValid>
                <FormRow>Form is valid</FormRow>
              </Condition>
              <FormRow>
                <Submit controller={controller}>Submit</Submit>{" "}
                <button type="button" onClick={() => controller.resetForm()}>
                  Reset
                </button>
              </FormRow>
            </>
          );
        }}
      </FormController>
    </>
  );
};
