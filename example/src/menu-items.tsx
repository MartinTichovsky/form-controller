import { SimpleForm } from "./basic/SimpleForm";
import { SimpleFormValidateOnChange } from "./basic/SimpleFormValidateOnChange";
import { SimpleFormWithDisabledSubmit } from "./basic/SimpleFormWithDisabledSubmit";
import { SimpleFormWithLabel } from "./basic/SimpleFormWithLabel";
import { ComponentError } from "./customized/ComponentError";
import { ComponentInput } from "./customized/ComponentInput";
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
      label: "Simple Form With Label",
      key: "simple-form-with-label",
      render: () => <SimpleFormWithLabel />
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
      label: "Disabled Input",
      key: "disabled-input",
      render: () => <DisabledInput />
    },
    {
      label: "Component Input",
      key: "component-input",
      render: () => <ComponentInput />
    },
    {
      label: "Component Error",
      key: "component-error",
      render: () => <ComponentError />
    }
  ]
};
