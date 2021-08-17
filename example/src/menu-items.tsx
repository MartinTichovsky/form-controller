import { SimpleForm } from "./basic/SimpleForm";
import { SimpleFormValidateOnChange } from "./basic/SimpleFormValidateOnChange";
import { SimpleFormWithDisabledSubmit } from "./basic/SimpleFormWithDisabledSubmit";
import { SimpleFormWithLabel } from "./basic/SimpleFormWithLabel";
import { ComponentError } from "./customized/ComponentError";
import { ComponentInput } from "./customized/ComponentInput";
import { ComponentSubmit } from "./customized/ComponentSubmit";
import { ConditionForm } from "./customized/ConditionForm";
import { CustomSubmit } from "./customized/CustomSubmit";
import { DisabledInput } from "./customized/DisabledInput";
import { DisableOnSubmit } from "./customized/DisableOnSubmit";

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
      label: "Simple Form with Label",
      key: "simple-form-with-label",
      render: () => <SimpleFormWithLabel />
    },
    {
      label: "Simple Form with Disabled Submit",
      key: "simple-form-with-disabled-submit",
      render: () => <SimpleFormWithDisabledSubmit />
    },
    {
      label: "Simple Form with Validate on Change",
      key: "simple-form-with-validate-on-change",
      render: () => <SimpleFormValidateOnChange />
    }
  ],
  Customized: [
    {
      label: "Condition in Form",
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
    },
    {
      label: "Component Submit",
      key: "component-submit",
      render: () => <ComponentSubmit />
    },
    {
      label: "Custom Submit",
      key: "custom-submit",
      render: () => <CustomSubmit />
    },
    {
      label: "Disable on Submit",
      key: "disable-on-submit",
      render: () => <DisableOnSubmit />
    }
  ]
};
