import React from "react";
import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";
import {
  disableIfContext,
  hideIfContext,
  sharedPropsContext,
  validateContext
} from "../../providers";
import { ValidationAction } from "../../providers.types";
import { SharedProps } from "../Validation.types";
import { Field } from "./Field";
import {
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldPrivateProps,
  FieldType,
  InitialState
} from "./types";

let idCounter = 0;

const getRandomId = () => `input-${++idCounter}`;

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
    validate,
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

  if (validate !== undefined && typeof validate !== "function") {
    throw new Error("Validate is not a function");
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
    validate
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

  if (!providedProps.validate) {
    providedProps.validate = React.useContext(validateContext);
  }

  if (!providedProps.validate) {
    providedProps.validate = controller.getValidateCondition(name);
  }

  const sharedProps: SharedProps = React.useContext(sharedPropsContext);

  if (providedProps.hideRequiredStar === undefined) {
    providedProps.hideRequiredStar = sharedProps.hideRequiredStar;
  }

  if (providedProps.hideMessage === undefined) {
    providedProps.hideMessage = sharedProps.hideMessage;
  }

  if (providedProps.required === undefined) {
    providedProps.required = sharedProps.required as typeof rest.required;
  }

  if (providedProps.requiredComponent === undefined) {
    providedProps.requiredComponent = sharedProps.requiredComponent;
  }

  let validation:
    | ValidationAction<T[K] | undefined, T, typeof rest>
    | undefined = providedProps.validate;

  if (providedProps.required && providedProps.validate) {
    validation = (
      value: T[K] | undefined,
      fields: Partial<T>,
      props: typeof rest
    ) => {
      if (
        rest.type === "checkbox" ||
        rest.type === "radio" ||
        rest.fieldType === "select"
      ) {
        const validationResult = providedProps.validate!(value, fields, props);

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
        : providedProps.validate!(value, fields, props);
    };
  } else if (providedProps.required) {
    validation = (value: T[K] | undefined) =>
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
    validation &&
    validation(
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
      isValidated: rest.type !== "radio" && !!(initialValidation && validation),
      key: name,
      type: rest.type,
      validationResult: initialValidation ? validationResult : undefined
    });
  } else if (!initialState.isVisible) {
    controller.setDefaultIsNotVisible({
      id: providedProps.id,
      isValidated: rest.type !== "radio" && !!(initialValidation && validation),
      key: name,
      type: rest.type,
      validationResult: initialValidation ? validationResult : undefined,
      value: value || children
    });
  } else if (validation) {
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
    validate: validation
  };

  return (
    <Field<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      {...fieldProps}
    />
  );
}
