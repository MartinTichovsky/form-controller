import React from "react";
import { FormFields, ValidationResult } from "./controller";

type ValidationAction<T> = (
  value: T | undefined,
  props: unknown
) => ValidationResult;

export const disableIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const hideIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const validateContext = React.createContext<
  ValidationAction<string | boolean> | undefined
>(undefined);

type ValidationProviderProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  readonly disableIf?: (fields: Partial<T>) => boolean;
  readonly hideIf?: (fields: Partial<T>) => boolean;
  readonly validate?: ValidationAction<T[K]>;
}>;

export const ValidationProvider = <T extends FormFields<T>, K extends keyof T>({
  children,
  disableIf,
  hideIf,
  validate
}: ValidationProviderProps<T, K>) => {
  let result = <>{children}</>;

  if (disableIf) {
    result = (
      <disableIfContext.Provider
        value={disableIf as (fields: unknown) => boolean}
      >
        {result}
      </disableIfContext.Provider>
    );
  }

  if (hideIf) {
    result = (
      <hideIfContext.Provider value={hideIf as (fields: unknown) => boolean}>
        {result}
      </hideIfContext.Provider>
    );
  }

  if (validate) {
    result = (
      <validateContext.Provider
        value={validate as ValidationAction<string | boolean>}
      >
        {result}
      </validateContext.Provider>
    );
  }

  return result;
};
