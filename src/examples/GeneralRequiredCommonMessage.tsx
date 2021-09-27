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
import { Template } from "./utils/Template";

type MyForm = {
  description: string;
  givenName: string;
  radio: string;
  select: string;
  surname: string;
};

const RequiredInvalidMessage = (props: { className: string }) => (
  <span {...props} style={{ color: "red", verticalAlign: "top" }}>
    This Field is required
  </span>
);

const RequiredValidMessage = (props: { className: string }) => (
  <span
    {...props}
    style={{ color: "green", fontSize: ".8em", verticalAlign: "top" }}
  >
    &#10003;
  </span>
);

export const GeneralRequiredCommonMessage = (
  props: Partial<FormControllerComponentProps<MyForm>> & {
    disableIfNotValid?: boolean;
    disabledByDefault?: boolean;
  }
) => {
  return (
    <Template>
      <FormController<MyForm>
        validateOnChange={true}
        {...props}
        onSubmit={(fields) => console.log(fields)}
        requiredInvalidMessage={
          <RequiredInvalidMessage className="invalid-global" />
        }
        requiredValidMessage={<RequiredValidMessage className="valid-global" />}
      >
        {(controller) => (
          <>
            <div data-testid="input-field-row-1" className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                label="Given name"
                name="givenName"
                placeholder="Input a given name"
                required
              />
            </div>
            <div data-testid="input-field-row-2" className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                label="Surname"
                name="surname"
                placeholder="Input a surname"
                required
              />
            </div>
            <Validation
              required
              requiredInvalidMessage={
                <RequiredInvalidMessage className="invalid-validation" />
              }
              requiredValidMessage={
                <RequiredValidMessage className="valid-validation" />
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
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2"
                  label="Option 2"
                  name="radio"
                  type="radio"
                  value="Option 2"
                />
              </div>
              <div className="field-row">
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
            <div data-testid="select-field-row" className="field-row">
              <Select
                controller={controller}
                data-testid="select"
                label="Select"
                name="select"
                required
              >
                <option></option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option value="option-3">Option 3</option>
              </Select>
            </div>
            <div data-testid="textarea-field-row" className="field-row">
              <Textarea
                controller={controller}
                data-testid="textarea"
                name="description"
                placeholder="Input a text"
                required
                requiredInvalidMessage={
                  <RequiredInvalidMessage className="invalid-field" />
                }
                requiredValidMessage={
                  <RequiredValidMessage className="valid-field" />
                }
              />
            </div>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit"
                disabledByDefault={props.disabledByDefault || true}
                disableIfNotValid={props.disableIfNotValid || true}
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
