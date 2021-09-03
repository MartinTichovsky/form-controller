import React from "react";
import { FormController, Select, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  select: string;
};

export const SelectField = (
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
                controller={controller}
                data-testid="select"
                name="select"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option value="option-3">Option 3</option>
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
              * Basic text field functionality, text fields must be not empty
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
