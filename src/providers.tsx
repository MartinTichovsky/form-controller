import React from "react";
import { CommonFieldProps } from "./components/Field/types";
import {
  OnChangeCondition,
  SelectProviderProps,
  ValidationAction,
  ValidationProviderProps
} from "./providers.types";

export const commonPropsContext = React.createContext<CommonFieldProps>({});

export const disableIfContext = React.createContext<
  OnChangeCondition | undefined
>(undefined);

export const hideIfContext = React.createContext<OnChangeCondition | undefined>(
  undefined
);

export const selectContext = React.createContext<
  SelectProviderProps | undefined
>(undefined);

export const validationContext = React.createContext<
  ValidationAction | undefined
>(undefined);

export const SelectProvider = ({
  children,
  ...rest
}: React.PropsWithChildren<SelectProviderProps>) => {
  return (
    <selectContext.Provider value={rest}>{children}</selectContext.Provider>
  );
};

export const ValidationProvider = ({
  children,
  disableIf,
  hideIf,
  validation,
  ...commonProps
}: React.PropsWithChildren<ValidationProviderProps>) => {
  let result = <>{children}</>;

  if (Object.keys(commonProps).length > 0) {
    result = (
      <commonPropsContext.Provider value={commonProps}>
        {result}
      </commonPropsContext.Provider>
    );
  }

  if (disableIf) {
    result = (
      <disableIfContext.Provider value={disableIf}>
        {result}
      </disableIfContext.Provider>
    );
  }

  if (hideIf) {
    result = (
      <hideIfContext.Provider value={hideIf}>{result}</hideIfContext.Provider>
    );
  }

  if (validation) {
    result = (
      <validationContext.Provider value={validation}>
        {result}
      </validationContext.Provider>
    );
  }

  return result;
};
