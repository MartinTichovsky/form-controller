import { Controller, FormFields, OnSubmit } from "../../controller";

export type FormControllerComponentProps<T extends FormFields<T>> =
  FormControllerProps<T> &
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export type FormControllerProps<T extends FormFields<T>> =
  React.PropsWithChildren<{
    initialValues?: Partial<T>;
    children: (controller: Controller<T>) => React.ReactNode;
    onSubmit?: OnSubmit<T>;
    validateOnChange?: boolean;
  }>;
