import React from "react";
import {
  Controller,
  ErrorFor,
  FormController,
  Input,
  Submit,
  Validation
} from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  disabled: string;
  givenName: string;
  hidden: string;
  surname: string;
  optional: string;
  radio: string;
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
      <FormController<MyForm>
        initialValues={{
          radio: "Option 1"
        }}
        style={{ marginTop: 15 }}
        validateOnChange
      >
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
                <Input
                  controller={controller}
                  hideIf={(fields) => !fields.givenName}
                  name="hidden"
                  placeholder="Hidden"
                />
              </FormRow>
              <Validation
                validate={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              >
                <ErrorFor controller={controller} name="radio">
                  Error
                </ErrorFor>
                <FormRow>
                  <Input
                    controller={controller}
                    disableIf={(fields) => !fields.givenName?.trim()}
                    label="Label 1"
                    name="radio"
                    type="radio"
                    value="Option 1"
                  />
                </FormRow>
                <FormRow>
                  <Input
                    controller={controller}
                    label="Label 2"
                    name="radio"
                    type="radio"
                    value="Option 2"
                  />
                </FormRow>
              </Validation>
              <FormRow>
                <CustomSubmitComponent controller={controller} />
              </FormRow>
              <FormRow>
                <Submit
                  controller={controller}
                  disableIfNotValid
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
