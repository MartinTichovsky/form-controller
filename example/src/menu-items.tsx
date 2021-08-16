import { SimpleForm } from "./basics/SimpleForm";
import { SimpleFormValidateOnChange } from "./basics/SimpleFormValidateOnChange";
import { SimpleFormWithDisabledSubmit } from "./basics/SimpleFormWithDisabledSubmit";
import { ConditionForm } from "./customized/ConditionForm";
import { DisabledInput } from "./customized/DisabledInput";

interface MenuIitem {
  label: string;
  key: string;
  render: () => JSX.Element;
}

interface MenuItems {
  [key: string]: MenuIitem[];
}

export const menuItems: MenuItems = {
  Basic: [
    {
      label: "Simple Form",
      key: "simple-form",
      render: () => <SimpleForm />
    },
    {
      label: "Simple Form With Disabled Submit",
      key: "simple-form-with-disabled-submit",
      render: () => <SimpleFormWithDisabledSubmit />
    },
    {
      label: "Simple Form With Validate On Change",
      key: "simple-form-with-validate-on-change",
      render: () => <SimpleFormValidateOnChange />
    }
  ],
  Customized: [
    {
      label: "Condition In Form",
      key: "condition-in-form",
      render: () => <ConditionForm />
    },
    {
      label: "Disabled input",
      key: "disabled-input",
      render: () => <DisabledInput />
    }
  ]
};
