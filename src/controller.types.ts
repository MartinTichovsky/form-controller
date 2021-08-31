import { Controller } from "./controller";

export type Action = () => void;
export type AfterAll<T> = {
  disable: Map<keyof T, Action>;
  validate: Action[];
  validateAll: Map<keyof T, Action>;
  visible: Map<keyof T, Action>;
};
export type ControllerType<T extends FormFields<T>> = {
  disableIf?: {
    [key in keyof T]?: (fields: Partial<T>) => boolean;
  };
  hideIf?: {
    [key in keyof T]?: (fields: Partial<T>) => boolean;
  };
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
          props: unknown
        ) => ValidationResult;
      };
};
export type DefaultActiveRadioId<T> = { [key in keyof T]?: string };
export type DefaultDisabledRadioId<T> = { [key in keyof T]?: string[] };
export type DisableIf<T> = {
  [key in keyof T]?: (fields: Partial<T>) => boolean;
};
export type Fields<T> = {
  [K in keyof T]?: {
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
export type KeyType<T> = { key: keyof T; type?: FieldTypes };
export type OnDisable<T> = { action: OnDisableAction; key: keyof T };
export type OnDisableAction = (disable: boolean) => void;
export type OnChangeAction = (isValid: boolean) => void;
export type OnSubmit<T extends FormFields<T>> = (
  fields: Partial<T>,
  controller: Controller<T>
) => void;
export type OnValidate<T> = {
  action: OnValidateAction;
  key: keyof T;
};
export type OnValidateAction = (show: boolean, fieldIsValid: boolean) => void;
export type SetDefaultIsDisabled<T> = {
  id?: string;
  key: keyof T;
  type?: FieldTypes;
};
export type SetDefaultIsNotVisible<T> = {
  id?: string;
  key: keyof T;
  type?: FieldTypes;
  value?: string | React.ReactNode;
};
export type SetIsDisabled<T> = {
  id?: string;
  isDisabled: boolean;
  key: keyof T;
  type?: FieldTypes;
};
export type SetIsVisible<T> = {
  id?: string;
  isVisible: boolean;
  key: keyof T;
  type?: string;
};
export type SubscribeValidator<T> = {
  action: ValidatorResultAction;
  id?: string;
  key: keyof T;
  type?: string;
  validate: ValidatorAction;
};
export type Validation<T> = {
  [key in keyof T]?: (
    value: T[key] | undefined,
    props: unknown
  ) => ValidationResult;
};
export type ValidationContentResult =
  | boolean
  | string
  | null
  | undefined
  | JSX.Element;
export type ValidationPromise = () => Promise<ValidationPromiseResult>;
export type ValidationPromiseCounter<T> = { [key in keyof T]?: number };
export type ValidationPromiseResult = {
  isValid: boolean;
  content?: string | JSX.Element;
};
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
export type Validator = {
  action?: ValidatorResultAction;
  actions?: Set<ValidatorResultAction>;
  validate: ValidatorAction;
};
export type ValidatorAction = () => ValidationResult;
export type ValidatorResultAction = (
  validationResult: ValidationResult
) => void;
export type Value = string | boolean | undefined;
