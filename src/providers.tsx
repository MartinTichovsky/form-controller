import React from "react";
import { FormFields } from "./controller";

type ValidationAction<T> = (
  value: T | undefined,
  props: unknown
) => false | string | null | undefined;

export const validationContext = React.createContext<
  ValidationAction<string | boolean> | undefined
>(undefined);

type ValidationProviderProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  readonly validation: ValidationAction<T[K]>;
}>;

export const ValidationProvider = <T extends FormFields<T>, K extends keyof T>(
  props: ValidationProviderProps<T, K>
) => {
  const { children, validation } = props;

  return (
    <validationContext.Provider
      value={validation as ValidationAction<string | boolean>}
    >
      {children}
    </validationContext.Provider>
  );
};
