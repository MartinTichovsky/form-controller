import React from "react";
import {
  FormController,
  Input,
  Select,
  Submit,
  Textarea,
  Validation
} from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { requiredStarClassName } from "../constants";
import { Template } from "./utils/Template";

type MyForm = {
  description: string;
  checkbox1: boolean;
  checkbox2: boolean;
  givenName: string;
  radio: string;
  select: string;
  surname: string;
};

export const GeneralRequired = ({
  disableIfNotValid = true,
  disabledByDefault = true,
  validateOnChange = true,
  ...props
}: Partial<FormControllerComponentProps<MyForm>> & {
  disableIfNotValid?: boolean;
  disabledByDefault?: boolean;
}) => {
  return (
    <Template>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
        validateOnChange={validateOnChange}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                label="Given name"
                name="givenName"
                placeholder="Input a given name"
                required
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                label="Surname"
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
                  value!.trim().length < 4 && (
                    <span style={{ color: "red" }}>
                      Surname must have at least 4 letters
                    </span>
                  )
                }
              />
            </div>
            <Validation
              required
              validate={(value) =>
                !value && <span style={{ color: "red" }}>Select an option</span>
              }
            >
              <div className="field-row" data-testid="radio-field-row-1">
                <Input
                  controller={controller}
                  data-testid="radio-1"
                  hideIf={(fields) => !fields.givenName?.trim()}
                  label="Option 1"
                  name="radio"
                  type="radio"
                  value="Option 1"
                />
              </div>
              <div className="field-row" data-testid="radio-field-row-2">
                <Input
                  controller={controller}
                  data-testid="radio-2"
                  label="Option 2"
                  name="radio"
                  type="radio"
                  value="Option 2"
                />
              </div>
              <div className="field-row" data-testid="radio-field-row-3">
                <Input
                  controller={controller}
                  data-testid="radio-3"
                  label="Option 3"
                  name="radio"
                  type="radio"
                  value="Option 3"
                />
              </div>
            </Validation>
            <div className="field-row">
              <Select
                controller={controller}
                data-testid="select"
                label="Select"
                name="select"
                required
                validate={(value) =>
                  !value && (
                    <span style={{ color: "red" }}>Select an option</span>
                  )
                }
              >
                <option></option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option value="option-3">Option 3</option>
              </Select>
            </div>
            <div className="field-row">
              <Textarea
                controller={controller}
                data-testid="textarea"
                name="description"
                placeholder="Input a text"
                required
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="checkbox-1"
                label="Required with message"
                name="checkbox1"
                required
                type="checkbox"
                validate={(value) =>
                  !value && (
                    <span style={{ color: "red" }}>
                      This checkbox must be checked
                    </span>
                  )
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="checkbox-2"
                label="Required without message"
                name="checkbox2"
                required
                type="checkbox"
              />
            </div>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit"
                disabledByDefault={disabledByDefault}
                disableIfNotValid={disableIfNotValid}
              >
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
              * All fields are required. The star is provided on first input
              with default way, the second input is consuming the star as a
              element. The fields have red border, if they are not valid and
              green if they are valid. Some fields show an error message if they
              are invalid. The submit button is disabled until the form is not
              valid.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
