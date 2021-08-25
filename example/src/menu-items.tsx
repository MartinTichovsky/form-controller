import { GeneralCondition } from "form-controller/lib/examples/GeneralCondition";
import { GeneralDisableAllOnSubmit } from "form-controller/lib/examples/GeneralDisableAllOnSubmit";
import { GeneralErrorFor } from "form-controller/lib/examples/GeneralErrorFor";
import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralValidateOnChange } from "form-controller/lib/examples/GeneralValidateOnChange";
import { GeneralValidation } from "form-controller/lib/examples/GeneralValidation";
import { SubmitComponent } from "form-controller/lib/examples/SubmitComponent";
import { SubmitCustom } from "form-controller/lib/examples/SubmitCustom";
import { SubmitDefaultDisabled } from "form-controller/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "form-controller/lib/examples/SubmitDisabledOnSubmit";
import { TextField } from "form-controller/lib/examples/TextField";
import { TextFieldDefaultValues } from "form-controller/lib/examples/TextFieldDefaultValues";
import { TextFieldDisabled } from "form-controller/lib/examples/TextFieldDisabled";
import { TextFieldErrorComponent } from "form-controller/lib/examples/TextFieldErrorComponent";
import { TextFieldInputComponent } from "form-controller/lib/examples/TextFieldInputComponent";

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
      label: "Basic Text Fields",
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
    },
    {
      label: "Error Component",
      key: "error-component",
      render: () => <TextFieldErrorComponent />
    },
    {
      label: "Input Component",
      key: "input-component",
      render: () => <TextFieldInputComponent />
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
    },
    {
      label: "Submit Component",
      key: "submit-component",
      render: () => <SubmitComponent />
    },
    {
      label: "Submit Custom",
      key: "submit-custom",
      render: () => <SubmitCustom />
    }
  ],
  General: [
    {
      label: "Condition",
      key: "condition",
      render: () => <GeneralCondition />
    },
    {
      label: "Disable All on Submit",
      key: "disable-all-on-submit",
      render: () => <GeneralDisableAllOnSubmit />
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
    },
    {
      label: "Validation Provided Through Parent Element",
      key: "validation",
      render: () => <GeneralValidation />
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
