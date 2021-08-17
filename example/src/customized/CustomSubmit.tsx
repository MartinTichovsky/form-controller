import React from "react";
import { Controller, FormController, Input } from "form-controller";
import { FormRow } from "../common-components";

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
      setTimeout(() => {
        if (isMounted.current) {
          setPending(false);
          controller.resetForm();
        }
      }, 2000);
    }
  };

  return (
    <button onClick={handleClick}>{pending ? "loading..." : "Submit"}</button>
  );
};

export const CustomSubmit = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <div>
        <button type="button" onClick={() => setCounter(counter + 1)}>
          Re-Render Form: {counter}
        </button>
      </div>
      <FormController<MyForm> style={{ marginTop: 15 }} validateOnChange>
        {(controller) => {
          return (
            <>
              <FormRow>
                <Input
                  controller={controller}
                  name="givenName"
                  placeholder="Input a given name"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid given name"
                  }
                />
              </FormRow>
              <FormRow>
                <Input
                  controller={controller}
                  name="surname"
                  placeholder="Input a surname"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid surname"
                  }
                />
              </FormRow>

              <FormRow>
                <CustomSubmitComponent controller={controller} />{" "}
                <button type="button" onClick={() => controller.resetForm()}>
                  Reset
                </button>
              </FormRow>
            </>
          );
        }}
      </FormController>
    </>
  );
};
