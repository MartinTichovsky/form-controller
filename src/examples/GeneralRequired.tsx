import React from "react";
import { FormController, Input, Submit } from "..";
import { requiredStarClassName } from "../constants";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralRequired = ({
  validateOnChange = true
}: {
  validateOnChange?: boolean;
}) => {
  return (
    <Template>
      <FormController<MyForm>
        data-testid="form-controller"
        onSubmit={(fields) => console.log(fields)}
        validateOnChange={validateOnChange}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                name="givenName"
                placeholder="Input a given name"
                required
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
                requiredComponent={
                  <span
                    className={requiredStarClassName}
                    style={{ color: "blue", marginLeft: 5 }}
                  >
                    *
                  </span>
                }
                required
                validate={(value) =>
                  value!.length < 4 && "Surname must have at least 4 letters"
                }
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
              * Fields have no validation and they are required. The star is
              provided on first input with default way, the second input is
              consuming the star as a element. The inputs have red color, if
              they are not valid and green if they are valid.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
