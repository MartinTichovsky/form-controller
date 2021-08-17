import React from "react";
import { Condition, FormController, Input, Submit } from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  givenName: string;
  surname: string;
};

export const ConditionForm = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <div>
        <button type="button" onClick={() => setCounter(counter + 1)}>
          Re-Render Form: {counter}
        </button>
      </div>
      <FormController<MyForm>
        onSubmit={(fields) => console.log(fields)}
        style={{ marginTop: 15 }}
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
              <Condition controller={controller} ifFormValid>
                <FormRow>Form is valid</FormRow>
              </Condition>
              <FormRow>
                <Submit controller={controller}>Submit</Submit>{" "}
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
