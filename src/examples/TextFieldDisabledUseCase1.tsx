import React from "react";
import { FormControllerComponentProps } from "../components/FormController/types";
import { FormController, Input, Submit } from "../index";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const TextFieldDisabledUseCase1 = (
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
                disableIf={(fields) => !fields.surname?.trim()}
                name="salutation"
                placeholder="Input salutation"
                validate={(value) =>
                  !value?.trim() && "Provide a valid salutation"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
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
                data-testid="input-3"
                disableIf={(fields) => !fields.givenName?.trim()}
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
                data-testid="submit"
                disableIfNotValid
                disabledByDefault
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
              * Salutation is disabled until the surname is not valid, the
              surname is disabled until the first name is not valid and the
              submit button is disabled until all text fields are filled
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
