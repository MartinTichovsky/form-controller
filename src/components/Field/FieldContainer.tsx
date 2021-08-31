import React from "react";
import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";
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
    controller,
    disableIf,
    hideMessage,
    hideIf,
    Component,
    label,
    MessageComponent,
    name,
    onFormChange,
    validate,
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

  let id: string | undefined = rest.id;

  id = (label && !id) || rest.type === "radio" ? getRandomId() : id;

  const initialState: InitialState = {
    isDisabled: _disableIf ? _disableIf(controller.fields) : false,
    isVisible: _hideIf ? !_hideIf(controller.fields) : true
  };

  if (initialState.isDisabled) {
    controller.setDefaultIsDisabled({
      id,
      key: name,
      type: rest.type
    });
  } else if (!initialState.isVisible) {
    controller.setDefaultIsNotVisible({
      id,
      key: name,
      type: rest.type,
      value: value || children
    });
  } else if (_validate && !_validate(controller.getFieldValue(name), rest)) {
    controller.setDefaultIsInvalid({
      key: name,
      type: rest.type
    });
  }

  const field = controller.getField(name);
  initialState.isValid = field === undefined || field.isValid;

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
