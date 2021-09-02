import { CheckboxField } from "form-controller/lib/examples/CheckboxField";
import { CheckboxFieldDefaultValues } from "form-controller/lib/examples/CheckboxFieldDefaultValues";
import { CheckboxFieldDisabled } from "form-controller/lib/examples/CheckboxFieldDisabled";
import { CheckboxFieldHidden } from "form-controller/lib/examples/CheckboxFieldHidden";
import { GeneralAsynchronousValidation } from "form-controller/lib/examples/GeneralAsynchronousValidation";
import { GeneralCondition } from "form-controller/lib/examples/GeneralCondition";
import { GeneralConditionDynamic } from "form-controller/lib/examples/GeneralConditionDynamic";
import { GeneralDisableAllOnSubmit } from "form-controller/lib/examples/GeneralDisableAllOnSubmit";
import { GeneralLabel } from "form-controller/lib/examples/GeneralLabel";
import { GeneralMessageForUseCase1 } from "form-controller/lib/examples/GeneralMessageForUseCase1";
import { GeneralMessageForUseCase2 } from "form-controller/lib/examples/GeneralMessageForUseCase2";
import { GeneralRequired } from "form-controller/lib/examples/GeneralRequired";
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
import { SelectFieldComponent } from "form-controller/lib/examples/SelectFieldComponent";
import { SelectFieldOptionDisabled } from "form-controller/lib/examples/SelectFieldOptionDisabled";
import { SelectFieldOptionHidden } from "form-controller/lib/examples/SelectFieldOptionHidden";
import { SubmitComponent } from "form-controller/lib/examples/SubmitComponent";
import { SubmitCustom } from "form-controller/lib/examples/SubmitCustom";
import { SubmitDefaultDisabled } from "form-controller/lib/examples/SubmitDefaultDisabled";
import { SubmitDisabledOnSubmit } from "form-controller/lib/examples/SubmitDisabledOnSubmit";
import { TextareaField } from "form-controller/lib/examples/TextareaField";
import { TextField } from "form-controller/lib/examples/TextField";
import { TextFieldComponent } from "form-controller/lib/examples/TextFieldComponent";
import { TextFieldDefaultValuesUseCase1 } from "form-controller/lib/examples/TextFieldDefaultValuesUseCase1";
import { TextFieldDefaultValuesUseCase2 } from "form-controller/lib/examples/TextFieldDefaultValuesUseCase2";
import { TextFieldDisabledUseCase1 } from "form-controller/lib/examples/TextFieldDisabledUseCase1";
import { TextFieldDisabledUseCase2 } from "form-controller/lib/examples/TextFieldDisabledUseCase2";
import { TextFieldHiddenUseCase1 } from "form-controller/lib/examples/TextFieldHiddenUseCase1";
import { TextFieldHiddenUseCase2 } from "form-controller/lib/examples/TextFieldHiddenUseCase2";
import { TextFieldMessageComponent } from "form-controller/lib/examples/TextFieldMessageComponent";
import { TextFieldValidationDependencies } from "form-controller/lib/examples/TextFieldValidationDependencies";

interface MenuIitem {
  label: string;
  key: string;
  render: () => JSX.Element;
}

interface MenuItems {
  [key: string]: MenuIitem[];
}

export const menuItems: MenuItems = {
  "Checkbox Fields": [
    {
      label: "Basic Checkbox Field",
      key: "checkbox-fields",
      render: () => <CheckboxField />
    },
    {
      label: "Disabled",
      key: "checkbox-field-disabled",
      render: () => <CheckboxFieldDisabled />
    },
    {
      label: "Default Values",
      key: "checkbox-field-default-values",
      render: () => <CheckboxFieldDefaultValues />
    },
    {
      label: "Hidden",
      key: "checkbox-field-hidden",
      render: () => <CheckboxFieldHidden />
    }
  ],
  "Radio Fields": [
    {
      label: "Basic Radio Fields",
      key: "radio-fields",
      render: () => <RadioField />
    },
    {
      label: "Default Values - UseCase 1",
      key: "radio-field-default-values-usecase-1",
      render: () => <RadioFieldDefaultValuesUseCase1 />
    },
    {
      label: "Default Values - UseCase 2",
      key: "radio-field-default-values-usecase-2",
      render: () => <RadioFieldDefaultValuesUseCase2 />
    },
    {
      label: "Disabled - UseCase 1",
      key: "disabled-radio-field-usecase-1",
      render: () => <RadioFieldDisabledUseCase1 />
    },
    {
      label: "Disabled - UseCase 2",
      key: "disabled-radio-field-usecase-2",
      render: () => <RadioFieldDisabledUseCase2 />
    },
    {
      label: "Disabled - UseCase 3",
      key: "disabled-radio-field-usecase-3",
      render: () => <RadioFieldDisabledUseCase3 />
    },
    {
      label: "Hidden - UseCase 1",
      key: "hidden-radio-field-usecase-1",
      render: () => <RadioFieldHiddenUseCase1 />
    },
    {
      label: "Hidden - UseCase 2",
      key: "hidden-radio-field-usecase-2",
      render: () => <RadioFieldHiddenUseCase2 />
    },
    {
      label: "Hidden - UseCase 3",
      key: "hidden-radio-field-usecase-3",
      render: () => <RadioFieldHiddenUseCase3 />
    }
  ],
  "Select Fields": [
    {
      label: "Basic Select Field",
      key: "select-fields",
      render: () => <SelectField />
    },
    {
      label: "Select Component",
      key: "select-field-component",
      render: () => <SelectFieldComponent />
    }
  ],
  "Select Field Options": [
    {
      label: "Disabled",
      key: "select-field-option-disabled",
      render: () => <SelectFieldOptionDisabled />
    },
    {
      label: "Hidden",
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
  "Text Fields": [
    {
      label: "Basic Text Fields",
      key: "text-fields",
      render: () => <TextField />
    },
    {
      label: "Disabled - UseCase 1",
      key: "disabled-text-field-usecase-1",
      render: () => <TextFieldDisabledUseCase1 />
    },
    {
      label: "Disabled - UseCase 2",
      key: "disabled-text-field-usecase-2",
      render: () => <TextFieldDisabledUseCase2 />
    },
    {
      label: "Default Values - UseCase 1",
      key: "text-field-default-values-usecase-1",
      render: () => <TextFieldDefaultValuesUseCase1 />
    },
    {
      label: "Default Values - UseCase 2",
      key: "text-field-default-values-usecase2",
      render: () => <TextFieldDefaultValuesUseCase2 />
    },
    {
      label: "Message Component",
      key: "text-field-message-component",
      render: () => <TextFieldMessageComponent />
    },
    {
      label: "Hidden - UseCase 1",
      key: "hidden-text-field-usecase-1",
      render: () => <TextFieldHiddenUseCase1 />
    },
    {
      label: "Hidden - UseCase 2",
      key: "hidden-text-field-usecase-2",
      render: () => <TextFieldHiddenUseCase2 />
    },
    {
      label: "Input Component",
      key: "text-field-input-component",
      render: () => <TextFieldComponent />
    },
    {
      label: "Validation Dependencies",
      key: "text-field-validation-dependencies",
      render: () => <TextFieldValidationDependencies />
    }
  ],
  "Textarea Fields": [
    {
      label: "Basic Textarea Fields",
      key: "textarea-fields",
      render: () => <TextareaField />
    }
  ],
  General: [
    {
      label: "Asynchronous Validation",
      key: "asynchronous-validation",
      render: () => <GeneralAsynchronousValidation />
    },
    {
      label: "Condition",
      key: "condition",
      render: () => <GeneralCondition />
    },
    {
      label: "Condition - Dynamic",
      key: "condition-dynamic",
      render: () => <GeneralConditionDynamic />
    },
    {
      label: "Disable All on Submit",
      key: "disable-all-on-submit",
      render: () => <GeneralDisableAllOnSubmit />
    },
    {
      label: "Required",
      key: "required",
      render: () => <GeneralRequired validateOnChange={false} />
    },
    {
      label: "MessageFor - UseCase 1",
      key: "message-for-usecase-1",
      render: () => <GeneralMessageForUseCase1 />
    },
    {
      label: "MessageFor - UseCase 2",
      key: "message-for-usecase-2",
      render: () => <GeneralMessageForUseCase2 />
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
