import React from "react";
import { FormController, Input, Submit } from "form-controller";
import { FormRow } from "../common-components";

type MyForm = {
  age: string;
  givenName: string;
  surname: string;
};

export const SimpleFormWithLabel = () => {
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
                <label htmlFor="given-name" style={{ marginRight: 10 }}>
                  Given name
                </label>
                <Input
                  controller={controller}
                  id="given-name"
                  name="givenName"
                  placeholder="Input a given name"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid given name"
                  }
                />
              </FormRow>
              <FormRow>
                <label htmlFor="surname" style={{ marginRight: 10 }}>
                  Surname
                </label>
                <Input
                  controller={controller}
                  id="surname"
                  name="surname"
                  placeholder="Input a surname"
                  validate={(value) =>
                    !value?.trim() && "Provide a valid surname"
                  }
                />
              </FormRow>
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
