import React from "react";
import { FormController, Input, Submit } from "../";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
  radio: string;
};

export const GeneralDisableAllOnSubmit = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm> {...props}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
              />
            </div>

            <div className="field-row">
              <Input
                controller={controller}
                data-testid="radio-1"
                label="Option 1"
                name="radio"
                type="radio"
                value="Option 1"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="radio-2"
                label="Option 2"
                name="radio"
                type="radio"
                value="Option 2"
              />
            </div>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit"
                disableIfNotValid
                onSubmit={(fields, controller) => {
                  console.log(fields);
                  controller.disableFields(true);
                }}
              >
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
              * When the form is submitted, all inputs will be disabled. Reset
              the form to enable them again. No validation is provided.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
