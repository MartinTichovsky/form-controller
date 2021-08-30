import React from "react";
import { FormController, Input, Submit } from "../";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

class ClassInputComponent extends React.Component<{
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
}> {
  render() {
    const {
      defaultValue,
      disabled,
      labelText,
      onChange,
      onKeyDown,
      placeholder,
      ...rest
    } = this.props;

    return (
      <span>
        <label htmlFor="class-input" style={{ marginRight: 10 }}>
          {labelText}
        </label>
        <input
          {...rest}
          defaultValue={defaultValue}
          disabled={disabled}
          id="class-input"
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
      </span>
    );
  }
}

const FunctionalInputComponent = ({
  defaultValue,
  disabled,
  labelText,
  onChange,
  onKeyDown,
  placeholder,
  ...rest
}: {
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
}) => {
  return (
    <span>
      <label htmlFor="functional-input" style={{ marginRight: 10 }}>
        {labelText}
      </label>
      <input
        {...rest}
        defaultValue={defaultValue}
        disabled={disabled}
        id="functional-input"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </span>
  );
};

export const TextFieldComponent = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                Component={ClassInputComponent}
                labelText="Class component"
                name="givenName"
                placeholder="Input a given name"
                validate={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                Component={FunctionalInputComponent}
                labelText="Functional component"
                name="surname"
                placeholder="Input a surname"
                validate={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row">
              <Submit controller={controller} data-testid="submit">
                Submit
              </Submit>{" "}
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * The first text field is created with a class input component.
              The second text field is created with a functional input
              component.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
