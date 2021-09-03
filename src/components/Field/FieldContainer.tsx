import React from "react";
import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";
import {
  commonPropsContext,
  disableIfContext,
  hideIfContext,
  validationContext
} from "../../providers";
import { Field } from "./Field";
import {
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldPrivateProps,
  FieldType,
  InitialState
} from "./types";

let idCounter = 0;

const getRandomId = () => `form-field-${++idCounter}`;

export function FieldContainer<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> &
      (ElementType extends HTMLInputElement
        ? FieldPrivateInputProps<ElementType>
        : FieldPrivateProps<ElementType>)
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
    > &
      FieldInternalProps
  >
) {
  const {
    children,
    Component,
    controller,
    disableIf,
    hideMessage,
    hideIf,
    hideRequiredStar,
    initialValidation,
    label,
    MessageComponent,
    name,
    onFormChange,
    requiredComponent,
    requiredInvalidMessage,
    requiredValidMessage,
    validation,
    validateOnChange,
    validationDependencies,
    value,
    ...rest
  } = props;

  if (!(controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (disableIf !== undefined && typeof disableIf !== "function") {
    throw new Error("DisableIf is not a function");
  }

  if (!name || typeof name !== "string") {
    throw new Error("Name must be a string");
  }

  if (onFormChange !== undefined && typeof onFormChange !== "function") {
    throw new Error("OnFormChange is not a function");
  }

  if (validation !== undefined && typeof validation !== "function") {
    throw new Error("Validation is not a function");
  }

  if (
    validationDependencies !== undefined &&
    !Array.isArray(validationDependencies)
  ) {
    throw new Error("ValidationDependencies must be an array");
  }

  if (!controller.registerKey(name, rest.type || "text")) {
    console.warn(`Key '${name}' is already registered in the form`);
  }

  if (validationDependencies) {
    controller.registerValidationDependencies(name, validationDependencies);
  }

  const providedProps = {
    disableIf,
    hideIf,
    hideRequiredStar,
    hideMessage,
    id: rest.id,
    required: rest.required,
    requiredComponent,
    requiredInvalidMessage,
    requiredValidMessage,
    validation
  };

  if (!providedProps.disableIf) {
    providedProps.disableIf = React.useContext(disableIfContext);
  }

  if (!providedProps.disableIf) {
    providedProps.disableIf = controller.getDisableCondition(name);
  }

  if (!providedProps.hideIf) {
    providedProps.hideIf = React.useContext(hideIfContext);
  }

  if (!providedProps.hideIf) {
    providedProps.hideIf = controller.getHideCondition(name);
  }

  if (!providedProps.validation) {
    providedProps.validation = React.useContext(validationContext);
  }

  if (!providedProps.validation) {
    providedProps.validation = controller.getValidationCondition(name);
  }

  const commonProps = React.useContext(commonPropsContext);

  for (let key in commonProps) {
    if (providedProps[key] === undefined) {
      providedProps[key] = commonProps[key];
    }
  }

  if (providedProps.requiredInvalidMessage === undefined) {
    providedProps.requiredInvalidMessage = controller.requiredInvalidMessage;
  }

  if (providedProps.requiredValidMessage === undefined) {
    providedProps.requiredValidMessage = controller.requiredValidMessage;
  }

  let _validation = providedProps.validation;

  if (providedProps.required && providedProps.validation) {
    _validation = ((
      value: T[K] | undefined,
      fields: Partial<T>,
      props: typeof rest
    ) => {
      if (
        rest.type === "checkbox" ||
        rest.type === "radio" ||
        rest.fieldType === "select"
      ) {
        const validationResult = providedProps.validation!(
          value,
          fields,
          props
        );

        return (
          validationResult ||
          (typeof value === "string"
            ? !value.trim()
            : rest.type === "checkbox"
            ? !value
            : value === undefined)
        );
      }

      return (
        typeof value === "string"
          ? !value.trim()
          : rest.type === "checkbox"
          ? !value
          : value === undefined
      )
        ? true
        : providedProps.validation!(value, fields, props);
    }) as typeof providedProps.validation;
  } else if (providedProps.required) {
    _validation = (value: T[K] | undefined) =>
      typeof value === "string"
        ? !value.trim()
        : rest.type === "checkbox"
        ? !value
        : value === undefined;
  }

  if (initialValidation !== undefined || validateOnChange !== undefined) {
    controller.setFieldProperties(name, {
      initialValidation,
      validateOnChange
    });
  }

  providedProps.id = (
    (label && !providedProps.id) || rest.type === "radio"
      ? getRandomId()
      : providedProps.id
  ) as typeof rest.id;

  if (rest.type === "radio") {
    controller.registerOption(name, providedProps.id!);
  }

  let validationResult =
    _validation &&
    _validation(
      controller.getFieldValue(name),
      controller.getObservedFields(name),
      rest
    );

  const initialState: InitialState = {
    isDisabled: providedProps.disableIf
      ? providedProps.disableIf(controller.fields)
      : false,
    isVisible: providedProps.hideIf
      ? !providedProps.hideIf(controller.fields)
      : true,
    message: initialValidation
      ? controller.getValidationResultContent(validationResult)
      : undefined
  };

  if (initialState.isDisabled) {
    controller.setDefaultIsDisabled({
      id: providedProps.id,
      isValidated:
        rest.type !== "radio" && !!(initialValidation && _validation),
      key: name,
      type: rest.type,
      validationResult: initialValidation ? validationResult : undefined
    });
  } else if (!initialState.isVisible) {
    controller.setDefaultIsNotVisible({
      id: providedProps.id,
      isValidated:
        rest.type !== "radio" && !!(initialValidation && _validation),
      key: name,
      type: rest.type,
      validationResult: initialValidation ? validationResult : undefined,
      value: value || children
    });
  } else if (_validation) {
    controller.setDefaultIsValid({
      initialValidation,
      isValidated: rest.type !== "radio",
      key: name,
      type: rest.type,
      validationResult
    });
  }

  const field = controller.getField(name);
  initialState.isValid = initialValidation
    ? !validationResult && (field === undefined || field.isValid)
    : undefined;

  const fieldProps = {
    ...props,
    ...providedProps,
    initialState,
    validation: _validation
  };

  return (
    <Field<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      {...fieldProps}
    />
  );
}
