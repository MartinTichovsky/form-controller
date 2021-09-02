import React from "react";
import { Controller } from "../../controller";
import { FormFields, ValidationResult } from "../../controller.types";

export interface InitialState {
  isDisabled: boolean;
  isValid?: boolean;
  isVisible: boolean;
  message: ValidationResult;
}

export interface FieldInitialProps {
  initialState: InitialState;
}

export interface FieldInternalProps {
  fieldType: "input" | "select" | "textarea";
}

export interface FieldPrivateInputProps<T> extends FieldPrivateProps<T> {
  onKeyDown: (event: React.KeyboardEvent<T>) => void;
}

export interface FieldPrivateProps<T> {
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<T>) => void;
}

export interface FieldPublicProps<T extends FormFields<T>, K extends keyof T> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  id?: string;
  initialValidation?: boolean;
  name: K;
  validateOnChange?: boolean;
}

export interface FieldState extends InitialState {
  isOnFirstPosition: boolean;
  isSelected: boolean;
}

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
  }: React.PropsWithChildren<
    FieldPublicProps<T, K> & {
      className?: string;
      hideRequiredStar?: boolean;
      onFormChange?: (name: K, props: typeof rest) => void;
      required?: boolean;
      requiredComponent?: JSX.Element;
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
                hideMessage?: boolean;
                label?: string | JSX.Element;
                placeholder?: string;
                type?:
                  | undefined
                  | "color"
                  | "date"
                  | "datetime-local"
                  | "email"
                  | "file"
                  | "image"
                  | "month"
                  | "number"
                  | "password"
                  | "range"
                  | "search"
                  | "tel"
                  | "text"
                  | "time"
                  | "url"
                  | "week";
                validate?: (
                  value: T[K] | undefined,
                  fields: Partial<T>,
                  props: typeof rest
                ) => ValidationResult;
                validationDependencies?: (keyof T)[];
                value?: undefined;
              }
            | {
                hideMessage?: undefined;
                label: string | JSX.Element;
                placeholder?: undefined;
                type: "radio";
                validate?: undefined;
                validationDependencies?: undefined;
                value: string;
              }
            | {
                hideMessage?: boolean;
                label: string | JSX.Element;
                placeholder?: undefined;
                type: "checkbox";
                validate?: (
                  value: T[K] | undefined,
                  fields: Partial<T>,
                  props: typeof rest
                ) => ValidationResult;
                validationDependencies?: (keyof T)[];
                value?: undefined;
              }
        : ElementType extends HTMLTextAreaElement
        ? {
            hideMessage?: boolean;
            label?: string | JSX.Element;
            placeholder?: string;
            type?: undefined;
            validate?: (
              value: T[K] | undefined,
              fields: Partial<T>,
              props: typeof rest
            ) => ValidationResult;
            validationDependencies?: (keyof T)[];
            value?: undefined;
          }
        : {
            hideMessage?: boolean;
            label?: string | JSX.Element;
            placeholder?: undefined;
            type?: undefined;
            validate?: (
              value: T[K] | undefined,
              fields: Partial<T>,
              props: typeof rest
            ) => ValidationResult;
            validationDependencies?: (keyof T)[];
            value?: undefined;
          })
  >): JSX.Element | null;
}

type RestProps<T> = Omit<
  T,
  | "children"
  | "Component"
  | "controller"
  | "disableIf"
  | "hideMessage"
  | "hideIf"
  | "hideRequiredStar"
  | "initialValidation"
  | "label"
  | "MessageComponent"
  | "name"
  | "onChange"
  | "onFormChange"
  | "requiredComponent"
  | "validate"
  | "validateOnChange"
  | "validationDependencies"
  | "value"
  // private props
  | "defaultValue"
  | "disabled"
  | "onChange"
  | "onKeyDown"
>;
