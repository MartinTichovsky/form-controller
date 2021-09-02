import { Controller } from "./controller";

export type Action = () => void;
export type AfterAll<T> = {
  disable: Map<keyof T, Action>;
  validate: Action[];
  validateAll: Map<keyof T, Action>;
  visible: Map<keyof T, Action>;
};
export interface ControllerProps<T extends FormFields<T>> {
  disableIf?: {
    [key in keyof T]?: (fields: Partial<T>) => boolean;
  };
  hideIf?: {
    [key in keyof T]?: (fields: Partial<T>) => boolean;
  };
  initialValidation?: boolean;
  initialValues?: Partial<T>;
  onSubmit?: OnSubmit<T>;
  setController: React.Dispatch<
    React.SetStateAction<Controller<T> | undefined>
  >;
  validateOnChange?: boolean;
  validation?:
    | {
        [key in keyof T]?: (
          value: T[key] | undefined,
          fields: Partial<T>,
          props: unknown
        ) => ValidationResult;
      };
}
export type DefaultActiveRadioId<T> = { [key in keyof T]?: string };
export type DefaultDisabledRadioId<T> = { [key in keyof T]?: string[] };
export type DisableIf<T> = {
  [key in keyof T]?: (fields: Partial<T>) => boolean;
};
export interface FieldAdditionalProperties {
  initialValidation?: boolean;
  validateOnChange?: boolean;
}
export type Fields<T> = {
  [K in keyof T]?: FieldAdditionalProperties & {
    activeId?: string;
    isDisabled: boolean;
    isValid: boolean;
    isValidated: boolean;
    isVisible: boolean;
    options?: Map<
      string,
      {
        isDisabled: boolean;
        isVisible: boolean;
      }
    >;
    validationInProgress: boolean;
    validationResult: ValidationContentResult;
    value: Value;
  };
};
export type FieldTypes =
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
export type FormFields<T> = { [K in keyof T]: Value };
export type HideIf<T> = { [key in keyof T]?: (fields: Partial<T>) => boolean };
export interface KeyType<T> {
  key: keyof T;
  type?: FieldTypes;
}
export interface OnDisable<T> {
  action: OnDisableAction;
  key: keyof T;
}
export type OnDisableAction = (disable: boolean) => void;
export type OnChangeAction = (isValid: boolean) => void;
export type OnSubmit<T extends FormFields<T>> = (
  fields: Partial<T>,
  controller: Controller<T>
) => void;
export interface OnValidate<T> {
  action: OnValidateAction;
  key: keyof T;
}
export type OnValidateAction = (
  show: boolean,
  fieldIsValid: boolean,
  validationResult: ValidationContentResult
) => void;
export interface SetDefaultIsDisabled<T> {
  id?: string;
  isValidated: boolean;
  key: keyof T;
  type?: FieldTypes;
  validationResult: ValidationResult;
}
export interface SetDefaultIsInvalid<T> {
  initialValidation?: boolean;
  isValidated: boolean;
  key: keyof T;
  type?: FieldTypes;
  validationResult: ValidationResult;
}
export interface SetDefaultIsNotVisible<T> {
  id?: string;
  isValidated: boolean;
  key: keyof T;
  type?: FieldTypes;
  validationResult: ValidationResult;
  value?: string | React.ReactNode;
}
export interface SetIsDisabled<T> {
  id?: string;
  isDisabled: boolean;
  key: keyof T;
  type?: FieldTypes;
}
export interface SetFieldValue<T> {
  id?: string;
  key: keyof T;
  silent?: boolean;
  value: Value;
}
export interface SetIsVisible<T> {
  id?: string;
  isVisible: boolean;
  key: keyof T;
  type?: string;
}
export interface SubscribeValidator<T> {
  action: ValidatorResultAction;
  id?: string;
  key: keyof T;
  type?: string;
  validate: ValidatorAction;
}
export type Validation<T> = {
  [key in keyof T]?: (
    value: T[key] | undefined,
    fields: Partial<T>,
    props: unknown
  ) => ValidationResult;
};
export type ValidationContentResult =
  | boolean
  | string
  | null
  | undefined
  | JSX.Element;
export type ValidationDependencies<T> = { [key in keyof T]?: Set<keyof T> };
export type ValidationPromise = () => Promise<ValidationPromiseResult>;
export type ValidationPromiseCounter<T> = { [key in keyof T]?: number };
export interface ValidationPromiseResult {
  isValid: boolean;
  content?: string | JSX.Element;
}
export type ValidationResult =
  | ValidationContentResult
  | {
      isValid: boolean;
      content?: string | JSX.Element;
    }
  | {
      content: string | JSX.Element;
      promise: ValidationPromise;
    };
export interface Validator {
  action?: ValidatorResultAction;
  actions?: Set<ValidatorResultAction>;
  validate: ValidatorAction;
}
export type ValidatorAction = () => ValidationResult;
export type ValidatorResultAction = (
  validationResult: ValidationResult
) => void;
export type Value = string | boolean | undefined;
