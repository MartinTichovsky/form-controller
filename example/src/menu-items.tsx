import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralValidateOnChange } from "form-controller/lib/examples/GeneralValidateOnChange";
import { SubmitDisabled } from "form-controller/lib/examples/SubmitDisabled";
import { TextField } from "form-controller/lib/examples/TextField";
import { TextFieldDefaultValues } from "form-controller/lib/examples/TextFieldDefaultValues";
import { TextFieldDisabled } from "form-controller/lib/examples/TextFieldDisabled";

interface MenuIitem {
  label: string;
  key: string;
  render: () => JSX.Element;
}

interface MenuItems {
  [key: string]: MenuIitem[];
}

export const menuItems: MenuItems = {
  "Text Fields": [
    {
      label: "Text Field",
      key: "text-field",
      render: () => <TextField />
    },
    {
      label: "Disabled Text Field",
      key: "disabled-text-field",
      render: () => <TextFieldDisabled />
    },
    {
      label: "Default Values",
      key: "default-values",
      render: () => <TextFieldDefaultValues />
    }
  ],
  Submit: [
    {
      label: "Disabled Submit",
      key: "disabled-submit",
      render: () => <SubmitDisabled />
    }
  ],
  General: [
    {
      label: "Label",
      key: "label",
      render: () => <GeneralLabel />
    },
    {
      label: "Validate on Change",
      key: "validate-on-change",
      render: () => <GeneralValidateOnChange />
    }
    // {
    //   label: "Condition in Form",
    //   key: "condition-in-form",
    //   render: () => <ConditionForm />
    // },
    // {
    //   label: "Component Input",
    //   key: "component-input",
    //   render: () => <ComponentInput />
    // },
    // {
    //   label: "Component Error",
    //   key: "component-error",
    //   render: () => <ComponentError />
    // },
    // {
    //   label: "Component Submit",
    //   key: "component-submit",
    //   render: () => <ComponentSubmit />
    // },
    // {
    //   label: "Custom Submit",
    //   key: "custom-submit",
    //   render: () => <CustomSubmit />
    // },
    // {
    //   label: "Disable on Submit",
    //   key: "disable-on-submit",
    //   render: () => <DisableOnSubmit />
    // }
  ]
};
