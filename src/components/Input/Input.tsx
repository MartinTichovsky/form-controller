import React from "react";
import { Controller, FormFields } from "../../controller";
import {
  disableIfContext,
  hideIfContext,
  validateContext
} from "../../providers";
import { InputComponent } from "./InputComponent";
import { InitialState, InputComponentType, InputPrivateProps } from "./types";

let idCounter = 0;

const getRandomId = () => `input-${++idCounter}`;

export const Input = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & InputPrivateProps
  >,
  EComponent extends React.ElementType
>({
  disableIf,
  id,
  hideIf,
  validate,
  ...props
}: React.ComponentProps<
  InputComponentType<T, K, IComponent, EComponent, never>
>) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (disableIf && typeof disableIf !== "function") {
    throw new Error("DisableIf is not a function");
  }

  if (!props.name || typeof props.name !== "string") {
    throw new Error("Name must be a string");
  }

  if (props.onFormChange && typeof props.onFormChange !== "function") {
    throw new Error("OnFormChange is not a function");
  }

  if (validate && typeof validate !== "function") {
    throw new Error("Validate is not a function");
  }

  if (!disableIf) {
    disableIf = React.useContext(disableIfContext);
  }

  if (!disableIf) {
    disableIf = props.controller.getDisableCondition(props.name);
  }

  if (!hideIf) {
    hideIf = React.useContext(hideIfContext);
  }

  if (!hideIf) {
    hideIf = props.controller.getHideCondition(props.name);
  }

  if (!validate) {
    validate = React.useContext(validateContext);
  }

  if (!validate) {
    validate = props.controller.getValidateCondition(props.name);
  }

  id = (props.label && !id) || props.type === "radio" ? getRandomId() : id;

  const initialState: InitialState = {
    isDisabled: disableIf ? disableIf(props.controller.fields) : false,
    isVisible: hideIf ? !hideIf(props.controller.fields) : true
  };

  if (initialState.isDisabled) {
    props.controller.setDefaultIsDisabled({
      id,
      key: props.name,
      type: props.type
    });
  } else if (!initialState.isVisible) {
    props.controller.setDefaultIsNotVisible({
      id,
      key: props.name,
      type: props.type
    });
  } else if (
    validate &&
    !validate(props.controller.getFieldValue(props.name), props)
  ) {
    props.controller.setDefaultIsInvalid({
      key: props.name,
      type: props.type
    });
  }

  return (
    <InputComponent
      {...({
        ...props,
        disableIf,
        id,
        hideIf,
        initialState,
        validate
      } as React.ComponentProps<
        InputComponentType<T, K, IComponent, EComponent, InitialState>
      >)}
    />
  );
};
