import React from "react";
import { FormController, Select, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  select1: string;
  select2: string;
};

class ClassSelectComponent extends React.Component<{
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // required
}> {
  render() {
    const { defaultValue, disabled, labelText, onChange, ...rest } = this.props;

    return (
      <span>
        <label htmlFor="class-select" style={{ marginRight: 10 }}>
          {labelText}
        </label>
        <select
          {...rest}
          defaultValue={defaultValue}
          disabled={disabled}
          id="class-select"
          onChange={onChange}
        >
          {this.props.children}
        </select>
      </span>
    );
  }
}

const FunctionalSelectComponent = React.forwardRef<
  HTMLSelectElement,
  React.PropsWithChildren<{
    defaultValue: string; // required
    disabled: boolean; // required
    labeltext: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // required
  }>
>(({ children, defaultValue, disabled, labeltext, onChange, ...rest }, ref) => {
  return (
    <span>
      <label htmlFor="functional-select" style={{ marginRight: 10 }}>
        {labeltext}
      </label>
      <select
        {...rest}
        defaultValue={defaultValue}
        disabled={disabled}
        ref={ref}
        id="functional-select"
        onChange={onChange}
      >
        {children}
      </select>
    </span>
  );
});

export const SelectFieldComponent = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Select
                Component={ClassSelectComponent}
                controller={controller}
                data-testid="select-1"
                labelText="Class Select"
                name="select1"
                validate={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 1-1</option>
                <option>Option 1-2</option>
                <option value="option-1-3">Option 1-3</option>
              </Select>
            </div>
            <div className="field-row">
              <Select
                Component={FunctionalSelectComponent}
                controller={controller}
                data-testid="select-2"
                labeltext="Functional Select"
                name="select2"
                validate={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 2-1</option>
                <option>Option 2-2</option>
                <option value="option-2-3">Option 2-3</option>
              </Select>
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
              * The first select field is created with a class select component.
              The second select field is created with a functional select
              component.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
