import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const InvalidFormUseCase1 = (
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
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                name="givenName"
                placeholder="Input a surname"
              />
            </div>
            <div className="field-row">
              <Submit controller={controller}>Submit</Submit>{" "}
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * An invalid form should log a warning in the console
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
