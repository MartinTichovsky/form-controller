import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { wait } from "../utils/utils";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  radio: string;
  surname: string;
};

export const GeneralAsynchronousValidation = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        validateOnChange
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
                validate={(value) => ({
                  content: "pending...",
                  promise: async function () {
                    await wait(2000);
                    return {
                      isValid: !!value?.trim(),
                      content: !value?.trim() ? (
                        <span style={{ color: "red" }}>
                          Provide a valid given name
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          Given name is valid
                        </span>
                      )
                    };
                  }
                })}
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
                validate={(value) => ({
                  content: "pending...",
                  promise: async function () {
                    await wait(2000);
                    return {
                      isValid: !!value?.trim(),
                      content: !value?.trim() ? (
                        <span style={{ color: "red" }}>
                          Provide a valid surname
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>Surname is valid</span>
                      )
                    };
                  }
                })}
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
              * The both input fields are validated using asynchronous action.
              This simulate calling API for a validation. After input a value
              the promise action is called. Input an empty text to show invalid
              result message, pending is set to 2s. When click on the submit
              button during the pending, the submit button is disabled until all
              pending actions are done. The pending text can be also replaced
              with HTML element, such as a loading icon.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
