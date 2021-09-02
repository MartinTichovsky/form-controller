import React from "react";
import { FormController, Input, Submit } from "..";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  middleName: string;
  surname: string;
};

export const TextFieldValidationDependencies = ({
  validateOnChange = false
}: {
  validateOnChange?: boolean;
}) => {
  return (
    <Template>
      <FormController<MyForm>
        data-testid="form-controller"
        onSubmit={(fields) => console.log(fields)}
        validateOnChange={validateOnChange}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
                validate={(_, fields) =>
                  !fields.middleName?.trim() && (
                    <span data-testid="error-1">
                      Provide a valid middle name
                    </span>
                  )
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="middleName"
                placeholder="Input a middle name"
                validate={(_, fields) => {
                  const surname = fields.surname;
                  const givenName = fields.givenName;
                  return (
                    (!surname?.trim() || !givenName?.trim()) && (
                      <span data-testid="error-2">
                        Provide a valid given name and surname
                      </span>
                    )
                  );
                }}
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-3"
                name="surname"
                placeholder="Input a surname"
                validate={(_, fields) =>
                  !fields.givenName?.trim() && (
                    <span data-testid="error-3">
                      Provide a valid given name
                    </span>
                  )
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
              * The inputs are validated based on other fields
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
