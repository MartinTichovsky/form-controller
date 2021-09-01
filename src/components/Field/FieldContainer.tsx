import React from "react";
import { Controller } from "../../controller";
import { FormFields, ValidationResult } from "../../controller.types";
import {
  disableIfContext,
  hideIfContext,
  validateContext
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
    validate,
    validateOnChange,
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

  if (!controller.registerKey(name, rest.type || "text")) {
    console.warn(`Key '${name}' is already registered in the form`);
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

  if (initialValidation !== undefined || validateOnChange !== undefined) {
    controller.setFieldProperties(name, {
      initialValidation,
      validateOnChange
    });
  }

  let id: string | undefined = rest.id;
  id = (label && !id) || rest.type === "radio" ? getRandomId() : id;

  let validationResult: ValidationResult;

  if (initialValidation && _validate) {
    validationResult = _validate(controller.getFieldValue(name), rest);
  }

  const initialState: InitialState = {
    isDisabled: _disableIf ? _disableIf(controller.fields) : false,
    isVisible: _hideIf ? !_hideIf(controller.fields) : true,
    message: controller.getValidationResultContent(validationResult)
  };

  if (initialState.isDisabled) {
    controller.setDefaultIsDisabled({
      id,
      isValidated: rest.type !== "radio" && !!(initialValidation && _validate),
      key: name,
      type: rest.type,
      validationResult
    });
  } else if (!initialState.isVisible) {
    controller.setDefaultIsNotVisible({
      id,
      isValidated: rest.type !== "radio" && !!(initialValidation && _validate),
      key: name,
      type: rest.type,
      validationResult,
      value: value || children
    });
  } else if (_validate) {
    controller.setDefaultIsValid({
      initialValidation,
      isValidated: rest.type !== "radio",
      key: name,
      type: rest.type,
      validationResult:
        validationResult === undefined
          ? _validate(controller.getFieldValue(name), rest)
          : validationResult
    });
  }

  const field = controller.getField(name);
  initialState.isValid =
    !validationResult && (field === undefined || field.isValid);

  const fieldProps = {
    ...props,
    disableIf: _disableIf,
    hideIf: _hideIf,
    id,
    initialState,
    validate: _validate
  };

  return (
    <Field<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      {...fieldProps}
    />
  );
}
