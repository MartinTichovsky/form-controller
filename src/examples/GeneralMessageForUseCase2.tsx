import React from "react";
import { FormController, Input, Submit } from "..";
import { MessageFor } from "../components/MessageFor";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const givenNameValidText = "Given name is valid";
export const surnameValidText = "Surname is valid";

export const GeneralMessageForUseCase2 = () => {
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
              <MessageFor
                controller={controller}
                isValid={true}
                name="givenName"
              >
                {givenNameValidText}
              </MessageFor>
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                hideMessage
                name="surname"
                placeholder="Input a surname"
                validate={(value) => !value?.trim()}
              />
            </div>
            <div className="field-row">
              <MessageFor controller={controller} isValid={true} name="surname">
                {surnameValidText}
              </MessageFor>
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
              * When a text field is valid, message outside the Input will be
              shown after submit
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
