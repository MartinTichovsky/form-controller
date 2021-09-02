import React from "react";
import { Condition, FormController, Input, Submit } from "../";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const formIsValidText = "Form is valid";
export const submitConditionText = "Submit button was clicked";

export const GeneralCondition = (
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
              <Input
                controller={controller}
                data-testid="input-1"
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
                name="surname"
                placeholder="Input a surname"
                validate={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <Condition controller={controller} ifFormValid>
              <div className="field-row">{formIsValidText}</div>
            </Condition>
            <Condition
              controller={controller}
              showIf={() => controller.isSubmitted}
            >
              <div className="field-row">{submitConditionText}</div>
            </Condition>
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
              * Text `Form is valid` will be shown after all text inputs are
              valid. Text `Submit button was clicked` will be shown after click
              on the submit button.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
