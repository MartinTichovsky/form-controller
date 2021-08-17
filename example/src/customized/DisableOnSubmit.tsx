import React from "react";
import { Controller, FormController, Input, Submit } from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  disabled: string;
  givenName: string;
  surname: string;
  optional: string;
};

const CustomSubmitComponent = ({
  controller
}: {
  controller: Controller<MyForm>;
}) => {
  const [pending, setPending] = React.useState(false);
  const [disabled, setDisable] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    const onDisableAction = (disable: boolean) => {
      setDisable(disable);
    };

    controller.subscribeOnDisableButton(onDisableAction);

    return () => {
      isMounted.current = false;
      controller.unsubscribeOnDisableButton(onDisableAction);
    };
  }, [controller, setDisable]);

  const handleClick = () => {
    controller.submit();

    if (controller.isValid) {
      console.log(controller.fields);
      controller.disableFields(true);
      setPending(true);

      setTimeout(() => {
        if (isMounted.current) {
          setPending(false);
          controller.disableFields(false);
        }
      }, 2000);
    }
  };

  return (
    <button disabled={disabled} onClick={handleClick}>
      {pending ? "loading..." : "Custom Submit"}
    </button>
  );
};

export const DisableOnSubmit = () => {
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
                <Input
                  controller={controller}
                  disableIf={(fields) => !!(fields.givenName && fields.surname)}
                  name="disabled"
                  placeholder="Disabled"
                />
              </FormRow>
              <FormRow>
                <Input
                  controller={controller}
                  name="optional"
                  placeholder="Optional"
                />
              </FormRow>
              <FormRow>
                <CustomSubmitComponent controller={controller} />
              </FormRow>
              <FormRow>
                <Submit
                  controller={controller}
                  onSubmit={(fields, controller) => {
                    if (controller.isValid) {
                      console.log(fields);
                      controller.disableFields(true);
                    }
                  }}
                >
                  Default Submit
                </Submit>
              </FormRow>
              <FormRow>
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
