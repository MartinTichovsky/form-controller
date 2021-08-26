import React from "react";
import { FormController, Input, Submit } from "..";
import { Validation } from "../components/Validation";
import { Template } from "./utils/Template";

type MyForm = {
  radioVolume1: string;
  radioVolume2: string;
  radioVolume3: string;
};

export const RadioFieldDisabledUseCase2 = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <Validation
              validate={(value) =>
                value === undefined && (
                  <span style={{ color: "red" }}>Choose an option</span>
                )
              }
            >
              <div className="field-row">
                <b>Radio Volume 1</b>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-1-1"
                  disableIf={(fields) => fields.radioVolume3 !== "Option 3-1"}
                  hideError={false}
                  label="Option 1-1"
                  name="radioVolume1"
                  type="radio"
                  value="Option 1-1"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-1-2"
                  disableIf={(fields) => fields.radioVolume3 !== "Option 3-2"}
                  label="Option 1-2"
                  name="radioVolume1"
                  type="radio"
                  value="Option 1-2"
                />
              </div>

              <div className="field-row">
                <b>Radio Volume 2</b>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2-1"
                  hideError={false}
                  label="Option 2-1"
                  name="radioVolume2"
                  type="radio"
                  value="Option 2-1"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2-2"
                  label="Option 2-2"
                  name="radioVolume2"
                  type="radio"
                  value="Option 2-2"
                />
              </div>

              <div className="field-row">
                <b>Radio Volume 3</b>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3-1"
                  disableIf={(fields) => fields.radioVolume2 !== "Option 2-1"}
                  hideError={false}
                  label="Option 3-1"
                  name="radioVolume3"
                  type="radio"
                  value="Option 3-1"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3-2"
                  disableIf={(fields) => fields.radioVolume2 !== "Option 2-2"}
                  label="Option 3-2"
                  name="radioVolume3"
                  type="radio"
                  value="Option 3-2"
                />
              </div>
            </Validation>
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
              * Options are enabled based on previous selection. The order must
              be Radio Volume 2 then Radio Volume 3.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
