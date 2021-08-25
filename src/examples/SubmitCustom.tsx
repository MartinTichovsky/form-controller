import React from "react";
import { Controller, FormController, Input } from "../";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const CustomSubmitComponent = ({
  controller
}: {
  controller: Controller<MyForm>;
}) => {
  const [pending, setPending] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = () => {
    controller.submit();

    if (controller.isValid) {
      console.log(controller.fields);

      setPending(true);

      // simulate HTTML request / delay
      setTimeout(() => {
        if (isMounted.current) {
          setPending(false);
        }
      }, 2000);
    }
  };

  return (
    <button data-testid="submit" onClick={handleClick}>
      {pending ? "pending..." : "Submit"}
    </button>
  );
};

export const SubmitCustom = () => {
  return (
    <Template>
      <FormController<MyForm> style={{ marginTop: 15 }} validateOnChange>
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
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
                name="surname"
                placeholder="Input a surname"
                validate={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row">
              <CustomSubmitComponent controller={controller} />{" "}
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * This example shows how to provide your own submit button,
              without using the form-controller Submit.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
