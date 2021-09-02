import React from "react";
import { FormController, Input, Submit, Validation } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralValidationUseCase1 = (
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
            <Validation
              validate={(value) =>
                (value === undefined ||
                  (typeof value === "string" && !value.trim())) &&
                "Provide a valid text"
              }
            >
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
            </Validation>
            <div className="field-row">
              <Submit data-testid="submit" controller={controller}>
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
              * Providing the validation as a parental element, it should show
              the same error for each text input
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
