import React from "react";
import { FormController, Input, Submit } from "../";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const GeneralLabel = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <div className="field-row">
              <label htmlFor="salutation">Salutation</label>{" "}
              <Input
                controller={controller}
                data-testid="input-1"
                id="salutation"
                name="salutation"
                placeholder="Input salutation"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                label="Given name"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-3"
                id="surname"
                label={
                  <>
                    <label htmlFor="surname">Surname</label>{" "}
                  </>
                }
                name="surname"
                placeholder="Input a surname"
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
            <div className="info">* Three ways how to provide a label</div>
          </>
        )}
      </FormController>
    </Template>
  );
};
