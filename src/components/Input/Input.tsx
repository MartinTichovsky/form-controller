import React from "react";
import { Controller, FormFields } from "../../controller";
import { InputComponent } from "./InputComponent";
import { InitialState, InputComponentType, InputPrivateProps } from "./types";

export const Input = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & InputPrivateProps
  >,
  EComponent extends React.ElementType
>(
  props: React.ComponentProps<
    InputComponentType<T, K, IComponent, EComponent, never>
  >
) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.disableIf && typeof props.disableIf !== "function") {
    throw new Error("DisableIf is not a function");
  }

  if (!props.name || typeof props.name !== "string") {
    throw new Error("Name must be a string");
  }

  if (props.onFormChange && typeof props.onFormChange !== "function") {
    throw new Error("OnFormChange is not a function");
  }

  if (props.validate && typeof props.validate !== "function") {
    throw new Error("Validate is not a function");
  }

  const initialState: InitialState = {
    isDisabled: props.disableIf
      ? props.disableIf(props.controller.fields)
      : false,
    isVisible: props.hideIf ? !props.hideIf(props.controller.fields) : true
  };

  if (initialState.isDisabled) {
    props.controller.setDefaultIsDisabled(
      props.name,
      props.validate
        ? !props.validate(props.controller.getFieldValue(props.name), props)
        : true
    );
  } else if (props.validate) {
    props.controller.setDefaultIsValid(
      props.name,
      !props.validate(props.controller.getFieldValue(props.name), props)
    );
  }

  return <InputComponent {...props} initialState={initialState} />;
};
