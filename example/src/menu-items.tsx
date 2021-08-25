import { GeneralCondition } from "form-controller/lib/examples/GeneralCondition";
import { GeneralErrorFor } from "form-controller/lib/examples/GeneralErrorFor";
import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralValidateOnChange } from "form-controller/lib/examples/GeneralValidateOnChange";
import { SubmitDefaultDisabled } from "form-controller/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "form-controller/lib/examples/SubmitDisabledOnSubmit";
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
      label: "Disabled Submit by Default",
      key: "disabled-submit-by-default",
      render: () => <SubmitDefaultDisabled />
    },
    {
      label: "Disabled Submit After Click",
      key: "disabled-submit-after-click",
      render: () => <SubmitDisabledOnSubmit />
    }
  ],
  General: [
    {
      label: "Condition",
      key: "condition",
      render: () => <GeneralCondition />
    },
    {
      label: "Error Outside the Input",
      key: "error-outside-the-input",
      render: () => <GeneralErrorFor />
    },
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
