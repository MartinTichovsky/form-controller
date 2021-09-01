import { Controller } from "../../controller";
import { FormFields, OnSubmit, ValidationResult } from "../../controller.types";

export type FormControllerComponentProps<T extends FormFields<T>> =
  FormControllerProps<T> &
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export type FormControllerProps<T extends FormFields<T>> =
  React.PropsWithChildren<{
    children: (controller: Controller<T>) => React.ReactNode;
    disableIf?: {
      [key in keyof T]?: (fields: Partial<T>) => boolean;
    };
    hideIf?: {
      [key in keyof T]?: (fields: Partial<T>) => boolean;
    };
    initialValidation?: boolean;
    initialValues?: Partial<T>;
    onSubmit?: OnSubmit<T>;
    validateOnChange?: boolean;
    validation?: {
      [key in keyof T]?: (
        value: T[key] | undefined,
        props: unknown
      ) => ValidationResult;
    };
  }>;
