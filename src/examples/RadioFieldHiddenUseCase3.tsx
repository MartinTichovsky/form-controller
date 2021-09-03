import React from "react";
import { FormController, Input, MessageFor, Submit, Validation } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { invalidMessageClassName } from "../constants";
import { Template } from "./utils/Template";

type MyForm = {
  radioVolume1: string;
  radioVolume2: string;
  radioVolume3: string;
};

export const RadioFieldHiddenUseCase3 = (
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
            <Validation validation={(value) => value === undefined}>
              <div className="field-row">
                <b>Radio Volume 1</b>
                <MessageFor controller={controller} name="radioVolume1">
                  <span
                    className={invalidMessageClassName}
                    style={{ color: "red", paddingLeft: 10 }}
                  >
                    Choose an option
                  </span>
                </MessageFor>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-1-1"
                  hideIf={(fields) => fields.radioVolume3 !== "Option 3-1"}
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
                  hideIf={(fields) => fields.radioVolume3 !== "Option 3-2"}
                  label="Option 1-2"
                  name="radioVolume1"
                  type="radio"
                  value="Option 1-2"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-1-3"
                  label="Option 1-3"
                  name="radioVolume1"
                  type="radio"
                  value="Option 1-3"
                />
              </div>

              <div className="field-row">
                <b>Radio Volume 2</b>
                <MessageFor controller={controller} name="radioVolume2">
                  <span
                    className={invalidMessageClassName}
                    style={{ color: "red", paddingLeft: 10 }}
                  >
                    Choose an option
                  </span>
                </MessageFor>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2-1"
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
                <MessageFor controller={controller} name="radioVolume3">
                  <span
                    className={invalidMessageClassName}
                    style={{ color: "red", paddingLeft: 10 }}
                  >
                    Choose an option
                  </span>
                </MessageFor>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3-1"
                  hideIf={(fields) => fields.radioVolume2 !== "Option 2-1"}
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
                  hideIf={(fields) => fields.radioVolume2 !== "Option 2-2"}
                  label="Option 3-2"
                  name="radioVolume3"
                  type="radio"
                  value="Option 3-2"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-3-3"
                  label="Option 3-3"
                  name="radioVolume3"
                  type="radio"
                  value="Option 3-3"
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
              * Options are shown based on previous selection. The order must be
              Radio Volume 2 then Radio Volume 3. The Option 1-3 and 3-3 are
              always visible.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
