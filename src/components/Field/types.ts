import React from "react";
import { Controller, FormFields, ValidationResult } from "../../controller";

export interface InitialState {
  isDisabled: boolean;
  isValid?: boolean;
  isVisible: boolean;
}

export interface FieldInternalProps {
  fieldType: "input" | "select";
}

export interface FieldInitialProps {
  initialState: InitialState;
}

export interface FieldPrivateProps<T> {
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<T>) => void;
}

export interface FieldPrivateInputProps<T> extends FieldPrivateProps<T> {
  onKeyDown: (event: React.KeyboardEvent<T>) => void;
}

export interface FieldPublicProps<T extends FormFields<T>, K extends keyof T> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  hideMessage?: boolean;
  id?: string;
  name: K;
}

type RestProps<T> = Omit<
  T,
  | "children"
  | "Component"
  | "controller"
  | "disableIf"
  | "hideMessage"
  | "hideIf"
  | "label"
  | "MessageComponent"
  | "name"
  | "onChange"
  | "onFormChange"
  | "validate"
  | "value"
  // private props
  | "defaultValue"
  | "disabled"
  | "onChange"
  | "onKeyDown"
>;

export interface FieldType<
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
> {
  ({
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
    FieldPublicProps<T, K> & {
      onFormChange?: (name: K, props: typeof rest) => void;
    } & (
        | ({
            Component: undefined;
            MessageComponent: undefined;
          } & RestProps<HTMLAttributesType>)
        | ({
            Component: undefined;
            MessageComponent: MComponent;
          } & RestProps<HTMLAttributesType>)
        | ({
            Component?: IComponent;
            MessageComponent?: MComponent;
          } & RestProps<React.ComponentPropsWithoutRef<IComponent>>)
      ) &
      (ElementType extends HTMLInputElement
        ?
            | {
                label?: string | JSX.Element;
                placeholder?: string;
                type?: undefined | "text" | "email" | "number";
                validate?: (
                  value: T[K] | undefined,
                  props: typeof rest
                ) => ValidationResult;
                value?: undefined;
              }
            | {
                label: string | JSX.Element;
                placeholder?: undefined;
                type: "radio";
                validate?: undefined;
                value: string;
              }
        : {
            label?: string | JSX.Element;
            placeholder?: undefined;
            type?: undefined;
            validate?: (
              value: T[K] | undefined,
              props: typeof rest
            ) => ValidationResult;
            value?: undefined;
          })
  >): JSX.Element | null;
}
