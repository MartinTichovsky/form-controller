import React from "react";
import { FormController, Input, Submit } from "..";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  radio: string;
  surname: string;
};

export const TextField = () => {
  return (
    <Template>
      <FormController<MyForm>
        data-testid="form-controller"
        onSubmit={(fields) => console.log(fields)}
        validateOnChange
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
                  content: "loading",
                  promise: async function () {
                    await new Promise((executor) => setTimeout(executor, 3000));
                    return {
                      isValid: !!value?.trim(),
                      content: !value?.trim() ? "error" : "ok"
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
                  isValid: !!value?.trim(),
                  content: !value?.trim() ? "error" : "ok",
                  promise: () =>
                    new Promise((resolve) => {
                      resolve({
                        isValid: !!value?.trim(),
                        content: !value?.trim() ? "error" : "ok"
                      });
                    })
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
              * Basic text field functionality, text fields must be not empty
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
