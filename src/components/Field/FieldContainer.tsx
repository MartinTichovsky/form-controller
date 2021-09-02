import React from "react";
import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";
import {
  disableIfContext,
  hideIfContext,
  validateContext
} from "../../providers";
import { ValidationAction } from "../../providers.types";
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

  let _disableIf = disableIf;

  if (!_disableIf) {
    _disableIf = React.useContext(disableIfContext);
  }

  if (!_disableIf) {
    _disableIf = controller.getDisableCondition(name);
  }

  let _hideIf = hideIf;

  if (!_hideIf) {
    _hideIf = React.useContext(hideIfContext);
  }

  if (!_hideIf) {
    _hideIf = controller.getHideCondition(name);
  }

  let _validate = validate;

  if (!_validate) {
    _validate = React.useContext(validateContext);
  }

  if (!_validate) {
    _validate = controller.getValidateCondition(name);
  }

  let validation:
    | ValidationAction<T[K] | undefined, T, typeof rest>
    | undefined = _validate;

  if (rest.required && _validate) {
    validation = (
      value: T[K] | undefined,
      fields: Partial<T>,
      props: typeof rest
    ) =>
      (
        value !== undefined && typeof value === "string"
          ? !value.trim()
          : value === undefined
      )
        ? true
        : _validate!(value, fields, props);
  } else if (rest.required) {
    validation = (value: T[K] | undefined) =>
      value !== undefined && typeof value === "string" ? !value.trim() : true;
  }

  if (initialValidation !== undefined || validateOnChange !== undefined) {
    controller.setFieldProperties(name, {
      initialValidation,
      validateOnChange
    });
  }

  let id: string | undefined = rest.id;
  id = (label && !id) || rest.type === "radio" ? getRandomId() : id;

  let validationResult =
    validation &&
    validation(
      controller.getFieldValue(name),
      controller.getObservedFields(name),
      rest
    );

  const initialState: InitialState = {
    isDisabled: _disableIf ? _disableIf(controller.fields) : false,
    isVisible: _hideIf ? !_hideIf(controller.fields) : true,
    message: initialValidation
      ? controller.getValidationResultContent(validationResult)
      : undefined
  };

  if (initialState.isDisabled) {
    controller.setDefaultIsDisabled({
      id,
      isValidated: rest.type !== "radio" && !!(initialValidation && validation),
      key: name,
      type: rest.type,
      validationResult: initialValidation ? validationResult : undefined
    });
  } else if (!initialState.isVisible) {
    controller.setDefaultIsNotVisible({
      id,
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
    disableIf: _disableIf,
    hideIf: _hideIf,
    id,
    initialState,
    validate: validation
  };

  return (
    <Field<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      {...fieldProps}
    />
  );
}
