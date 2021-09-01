import React from "react";
import { FormController, Input, Submit } from "..";
import { MessageFor } from "../components/MessageFor";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const givenNameErrorText = "Provide a valid given name";
export const surnameErrorText = "Provide a valid surname";

export const GeneralMessageForUseCase1 = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                hideMessage
                name="givenName"
                placeholder="Input a given name"
                validate={(value) => !value?.trim()}
              />
            </div>
            <div className="field-row">
              <MessageFor controller={controller} name="givenName">
                {givenNameErrorText}
              </MessageFor>
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                hideMessage
                name="surname"
                placeholder="Input a surname"
                validate={(value) => ({
                  content: surnameErrorText,
                  isValid: !!value?.trim()
                })}
              />
            </div>
            <div className="field-row">
              <MessageFor controller={controller} name="surname" />
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
              will be shown after submit. The both inputs have different using.
              The first text is taken from context of MessageFor component, the
              second text is taken from validation.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
