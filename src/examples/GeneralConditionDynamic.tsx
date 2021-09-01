import React from "react";
import { Condition, FormController, Input, Submit } from "..";
import { Controller } from "../controller";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const dynamicContent = (controller: Controller<MyForm>) => {
  return (
    <div className="field-row" data-testid="dynamic-content">
      Your given name is: {controller.getFieldValue("givenName")}
    </div>
  );
};

const DynamicContext = ({ controller }: { controller: Controller<MyForm> }) => {
  return (
    <div className="field-row" data-testid="dynamic-context">
      Your surname is: {controller.getFieldValue("surname")}
    </div>
  );
};

export const GeneralConditionDynamic = () => {
  return (
    <Template>
      <FormController<MyForm> onSubmit={(fields) => console.log(fields)}>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <Condition
              controller={controller}
              dynamicContent={dynamicContent}
            />
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
              />
            </div>
            <Condition controller={controller} dynamicRender>
              <DynamicContext controller={controller} />
            </Condition>
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
              * Text in conditions is filled based on typing in the inputs. Both
              condition are different. The first condition is consuming a
              function and the second is consuming a react component.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
