import { GeneralCondition } from "form-controller/lib/examples/GeneralCondition";
import { GeneralDisableAllOnSubmit } from "form-controller/lib/examples/GeneralDisableAllOnSubmit";
import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralMessageFor } from "form-controller/lib/examples/GeneralMessageFor";
import { GeneralValidateOnChange } from "form-controller/lib/examples/GeneralValidateOnChange";
import { GeneralValidationUseCase1 } from "form-controller/lib/examples/GeneralValidationUseCase1";
import { GeneralValidationUseCase2 } from "form-controller/lib/examples/GeneralValidationUseCase2";
import { RadioField } from "form-controller/lib/examples/RadioField";
import { RadioFieldDefaultValuesUseCase1 } from "form-controller/lib/examples/RadioFieldDefaultValuesUseCase1";
import { RadioFieldDefaultValuesUseCase2 } from "form-controller/lib/examples/RadioFieldDefaultValuesUseCase2";
import { RadioFieldDisabledUseCase1 } from "form-controller/lib/examples/RadioFieldDisabledUseCase1";
import { RadioFieldDisabledUseCase2 } from "form-controller/lib/examples/RadioFieldDisabledUseCase2";
import { RadioFieldDisabledUseCase3 } from "form-controller/lib/examples/RadioFieldDisabledUseCase3";
import { RadioFieldHiddenUseCase1 } from "form-controller/lib/examples/RadioFieldHiddenUseCase1";
import { RadioFieldHiddenUseCase2 } from "form-controller/lib/examples/RadioFieldHiddenUseCase2";
import { RadioFieldHiddenUseCase3 } from "form-controller/lib/examples/RadioFieldHiddenUseCase3";
import { SelectField } from "form-controller/lib/examples/SelectField";
import { SelectFieldOptionDisabled } from "form-controller/lib/examples/SelectFieldOptionDisabled";
import { SelectFieldOptionHidden } from "form-controller/lib/examples/SelectFieldOptionHidden";
import { SubmitComponent } from "form-controller/lib/examples/SubmitComponent";
import { SubmitCustom } from "form-controller/lib/examples/SubmitCustom";
import { SubmitDefaultDisabled } from "form-controller/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "form-controller/lib/examples/SubmitDisabledOnSubmit";
import { TextField } from "form-controller/lib/examples/TextField";
import { TextFieldComponent } from "form-controller/lib/examples/TextFieldComponent";
import { TextFieldDefaultValues } from "form-controller/lib/examples/TextFieldDefaultValues";
import { TextFieldDisabledUseCase1 } from "form-controller/lib/examples/TextFieldDisabledUseCase1";
import { TextFieldDisabledUseCase2 } from "form-controller/lib/examples/TextFieldDisabledUseCase2";
import { TextFieldHiddenUseCase1 } from "form-controller/lib/examples/TextFieldHiddenUseCase1";
import { TextFieldHiddenUseCase2 } from "form-controller/lib/examples/TextFieldHiddenUseCase2";
import { TextFieldMessageComponent } from "form-controller/lib/examples/TextFieldMessageComponent";

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
      label: "Message Component",
      key: "text-fields-message-component",
      render: () => <TextFieldMessageComponent />
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
      render: () => <TextFieldComponent />
    }
  ],
  "Radio Fields": [
    {
      label: "Basic Radio Fields",
      key: "radio-field",
      render: () => <RadioField />
    },
    {
      label: "Default Values - UseCase 1",
      key: "radio-fields-default-values-usecase-1",
      render: () => <RadioFieldDefaultValuesUseCase1 />
    },
    {
      label: "Default Values - UseCase 2",
      key: "radio-fields-default-values-usecase-2",
      render: () => <RadioFieldDefaultValuesUseCase2 />
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
  "Select Fields": [
    {
      label: "Select Field",
      key: "select-field",
      render: () => <SelectField />
    },
    {
      label: "Select Field Option - Disabled",
      key: "select-field-option-disabled",
      render: () => <SelectFieldOptionDisabled />
    },
    {
      label: "Select Field Option - Hidden",
      key: "select-field-option-hidden",
      render: () => <SelectFieldOptionHidden />
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
      render: () => <GeneralMessageFor />
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
      label: "Validation - UseCase 1",
      key: "validation-usecase-1",
      render: () => <GeneralValidationUseCase1 />
    },
    {
      label: "Validation - UseCase 2",
      key: "validation-usecase-2",
      render: () => <GeneralValidationUseCase2 />
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
