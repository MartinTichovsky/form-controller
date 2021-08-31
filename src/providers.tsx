import React from "react";
import { FormFields, ValidationResult } from "./controller.types";

type SelectProviderProps = {
  id?: string;
  name: string;
  selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
};

type ValidationAction<T> = (
  value: T | undefined,
  props: unknown
) => ValidationResult;

type ValidationProviderProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  readonly disableIf?: (fields: Partial<T>) => boolean;
  readonly hideIf?: (fields: Partial<T>) => boolean;
  readonly validate?: ValidationAction<T[K]>;
}>;

export const disableIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const hideIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const selectContext = React.createContext<
  SelectProviderProps | undefined
>(undefined);

export const validateContext = React.createContext<
  ValidationAction<string | boolean> | undefined
>(undefined);

export const SelectProvider = ({
  children,
  ...rest
}: React.PropsWithChildren<SelectProviderProps>) => {
  return (
    <selectContext.Provider value={rest}>{children}</selectContext.Provider>
  );
};

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
