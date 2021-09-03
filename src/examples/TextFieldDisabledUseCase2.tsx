import React from "react";
import { FormControllerComponentProps } from "../components/FormController/types";
import { FormController, Input, Submit } from "../index";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const TextFieldDisabledUseCase2 = (
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
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-3"
                disableIf={(fields) => !fields.givenName?.trim()}
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
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
              * The form is valid because `Given Name` field doesn't have a
              validation. You can submit an empty form. After typing your given
              name, you must fill your surname, otherwise is form invalid.
              Salutation is optional and it is disabled until given name and
              surname are not filled.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
