import React from "react";
import { FormController, Input, Submit } from "..";
import { FormControllerComponentProps } from "../components/FormController/types";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalMessageComponent = ({
  children
}: React.PropsWithChildren<{}>) => {
  return (
    <span data-testid="functional-component" style={{ marginLeft: 10 }}>
      Functional component error:{" "}
      <span style={{ color: "blue" }}>{children}</span>
    </span>
  );
};

class ClassMessageComponent extends React.Component {
  render() {
    return (
      <span data-testid="class-component" style={{ marginLeft: 10 }}>
        Class component error:{" "}
        <span style={{ color: "red" }}>{this.props.children}</span>
      </span>
    );
  }
}

export const TextFieldMessageComponent = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        validateOnChange
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
                MessageComponent={FunctionalMessageComponent}
                name="givenName"
                placeholder="Input a given name"
                validate={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-2"
                MessageComponent={ClassMessageComponent}
                name="surname"
                placeholder="Input a surname"
                validate={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row">
              <Submit data-testid="submit" controller={controller}>
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
              * The first text field is created with a functional error
              component (blue color on error). The second text field is created
              with a class error component (red color on error). Type an empty
              text to show an error.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
