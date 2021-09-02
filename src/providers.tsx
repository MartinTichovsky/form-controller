import React from "react";
import { SharedProps } from "./components/Validation.types";
import { FormFields } from "./controller.types";
import {
  SelectProviderProps,
  ValidationAction,
  ValidationProviderProps
} from "./providers.types";

export const disableIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const hideIfContext = React.createContext<
  ((fields: unknown) => boolean) | undefined
>(undefined);

export const selectContext = React.createContext<
  SelectProviderProps | undefined
>(undefined);

export const sharedPropsContext = React.createContext<SharedProps>({});

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
  validate,
  ...sharedProps
}: ValidationProviderProps<T, K>) => {
  let result = <>{children}</>;

  if (Object.keys(sharedProps).length > 0) {
    result = (
      <sharedPropsContext.Provider value={sharedProps}>
        {result}
      </sharedPropsContext.Provider>
    );
  }

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
