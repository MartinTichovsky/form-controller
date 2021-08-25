import React from "react";
import { FormController, Input, Submit } from "../index";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const SubmitDefaultDisabled = () => {
  return (
    <Template>
      <FormController<MyForm>
        onSubmit={(fields) => console.log(fields)}
        validateOnChange
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit-top"
                disableIfNotValid
                disabledByDefault
              >
                Top Submit
              </Submit>
            </div>
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
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit-bottom"
                disableIfNotValid
                disabledByDefault
              >
                Bottom Submit
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
              * After filling all text inputs, the submit buttons will be
              enabled
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
