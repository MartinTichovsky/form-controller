import React from "react";
import { FormController, Input, Submit } from "..";
import { ErrorFor } from "../components/ErrorFor";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const givenNameErrorText = "Provide a valid given name";
export const surnameErrorText = "Provide a valid surname";

export const GeneralErrorFor = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                hideError
                name="givenName"
                placeholder="Input a given name"
                validate={(value) => !value?.trim()}
              />
            </div>
            <div className="field-row">
              <ErrorFor controller={controller} name="givenName">
                {givenNameErrorText}
              </ErrorFor>
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                hideError
                name="surname"
                placeholder="Input a surname"
                validate={(value) => !value?.trim()}
              />
            </div>
            <div className="field-row">
              <ErrorFor controller={controller} name="surname">
                {surnameErrorText}
              </ErrorFor>
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
              * When a text field is not valid, error message outside the Input
              will be shown
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
