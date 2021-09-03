import React from "react";
import { FormController, Input, MessageFor, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const givenNameValidText = "Given name is valid";
export const surnameValidText = "Surname is valid";

export const GeneralMessageForUseCase2 = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                hideMessage
                name="givenName"
                placeholder="Input a given name"
                validation={(value) => !value?.trim()}
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
                validation={(value) => ({
                  content: surnameValidText,
                  isValid: !!value?.trim()
                })}
              />
            </div>
            <div className="field-row">
              <MessageFor
                controller={controller}
                isValid={true}
                name="surname"
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
              * When a text field is valid, message outside the Input will be
              shown after submit. The both inputs have different using. The
              first text is taken from context of MessageFor component, the
              second text is taken from validation.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
