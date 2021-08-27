import { GeneralCondition } from "form-controller/lib/examples/GeneralCondition";
import { GeneralDisableAllOnSubmit } from "form-controller/lib/examples/GeneralDisableAllOnSubmit";
import { GeneralErrorFor } from "form-controller/lib/examples/GeneralErrorFor";
import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralValidateOnChange } from "form-controller/lib/examples/GeneralValidateOnChange";
import { GeneralValidation } from "form-controller/lib/examples/GeneralValidation";
import { RadioField } from "form-controller/lib/examples/RadioField";
import { RadioFieldDisabledUseCase1 } from "form-controller/lib/examples/RadioFieldDisabledUseCase1";
import { RadioFieldDisabledUseCase2 } from "form-controller/lib/examples/RadioFieldDisabledUseCase2";
import { RadioFieldDisabledUseCase3 } from "form-controller/lib/examples/RadioFieldDisabledUseCase3";
import { RadioFieldHiddenUseCase1 } from "form-controller/lib/examples/RadioFieldHiddenUseCase1";
import { RadioFieldHiddenUseCase2 } from "form-controller/lib/examples/RadioFieldHiddenUseCase2";
import { RadioFieldHiddenUseCase3 } from "form-controller/lib/examples/RadioFieldHiddenUseCase3";
import { SubmitComponent } from "form-controller/lib/examples/SubmitComponent";
import { SubmitCustom } from "form-controller/lib/examples/SubmitCustom";
import { SubmitDefaultDisabled } from "form-controller/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "form-controller/lib/examples/SubmitDisabledOnSubmit";
import { TextField } from "form-controller/lib/examples/TextField";
import { TextFieldDefaultValues } from "form-controller/lib/examples/TextFieldDefaultValues";
import { TextFieldDisabledUseCase1 } from "form-controller/lib/examples/TextFieldDisabledUseCase1";
import { TextFieldDisabledUseCase2 } from "form-controller/lib/examples/TextFieldDisabledUseCase2";
import { TextFieldErrorComponent } from "form-controller/lib/examples/TextFieldErrorComponent";
import { TextFieldHiddenUseCase1 } from "form-controller/lib/examples/TextFieldHiddenUseCase1";
import { TextFieldHiddenUseCase2 } from "form-controller/lib/examples/TextFieldHiddenUseCase2";
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
      label: "Disabled Text Field - UseCase 1",
      key: "disabled-text-field-usecase-1",
      render: () => <TextFieldDisabledUseCase1 />
    },
    {
      label: "Disabled Text Field - UseCase 2",
      key: "disabled-text-field-usecase-2",
      render: () => <TextFieldDisabledUseCase2 />
    },
    {
      label: "Default Values",
      key: "text-fields-default-values",
      render: () => <TextFieldDefaultValues />
    },
    {
      label: "Error Component",
      key: "text-fields-error-component",
      render: () => <TextFieldErrorComponent />
    },
    {
      label: "Hidden Text Field - UseCase 1",
      key: "hidden-text-field-usecase-1",
      render: () => <TextFieldHiddenUseCase1 />
    },
    {
      label: "Hidden Text Field - UseCase 2",
      key: "hidden-text-field-usecase-2",
      render: () => <TextFieldHiddenUseCase2 />
    },
    {
      label: "Input Component",
      key: "text-fields-input-component",
      render: () => <TextFieldInputComponent />
    }
  ],
  "Radio Fields": [
    {
      label: "Basic Radio Fields",
      key: "radio-field",
      render: () => <RadioField />
    },
    {
      label: "Disabled Radio Field - UseCase 1",
      key: "disabled-radio-field-usecase-1",
      render: () => <RadioFieldDisabledUseCase1 />
    },
    {
      label: "Disabled Radio Field - UseCase 2",
      key: "disabled-radio-field-usecase-2",
      render: () => <RadioFieldDisabledUseCase2 />
    },
    {
      label: "Disabled Radio Field - UseCase 3",
      key: "disabled-radio-field-usecase-3",
      render: () => <RadioFieldDisabledUseCase3 />
    },
    {
      label: "Hidden Radio Field - UseCase 1",
      key: "hidden-radio-field-usecase-1",
      render: () => <RadioFieldHiddenUseCase1 />
    },
    {
      label: "Hidden Radio Field - UseCase 2",
      key: "hidden-radio-field-usecase-2",
      render: () => <RadioFieldHiddenUseCase2 />
    },
    {
      label: "Hidden Radio Field - UseCase 3",
      key: "hidden-radio-field-usecase-3",
      render: () => <RadioFieldHiddenUseCase3 />
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
