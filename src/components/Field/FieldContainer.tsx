import React from "react";
import { Controller, FormFields } from "../../controller";
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
>({
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
}: React.PropsWithChildren<
  React.ComponentProps<
    FieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
  >
> &
  FieldInternalProps) {
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

  if (!controller.registerKey(name, rest.type || "input")) {
    console.warn(`Key '${name}' is already registered in the form`);
  }

  if (!disableIf) {
    disableIf = React.useContext(disableIfContext);
  }

  if (!disableIf) {
    disableIf = controller.getDisableCondition(name);
  }

  if (!hideIf) {
    hideIf = React.useContext(hideIfContext);
  }

  if (!hideIf) {
    hideIf = controller.getHideCondition(name);
  }

  if (!validate) {
    validate = React.useContext(validateContext);
  }

  if (!validate) {
    validate = controller.getValidateCondition(name);
  }

  let id: string | undefined = rest.id;
  id = (label && !id) || rest.type === "radio" ? getRandomId() : id;

  const initialState: InitialState = {
    isDisabled: disableIf ? disableIf(controller.fields) : false,
    isVisible: hideIf ? !hideIf(controller.fields) : true
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
      type: rest.type
    });
  } else if (validate && !validate(controller.getFieldValue(name), rest)) {
    controller.setDefaultIsInvalid({
      key: name,
      type: rest.type
    });
  }

  const field = controller.getField(name);
  initialState.isValid = field === undefined || field.isValid;

  return (
    <Field<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      {
        ...({
          ...rest,
          children,
          controller,
          disableIf,
          hideMessage,
          hideIf,
          id,
          initialState,
          Component,
          label,
          MessageComponent,
          name,
          onFormChange,
          validate,
          value
        } as any) /*React.ComponentProps<
        FieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
      > &
        FieldInternalProps &
        FieldInitialProps*/
      }
    />
  );
}
