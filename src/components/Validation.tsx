import React from "react";
import { FormFields } from "../controller.types";
import { ValidationProvider } from "../providers";
import { ValidationProps } from "./Validation.types";

export const Validation = <T extends FormFields<T>>({
  children,
  disableIf,
  hideIf,
  validate,
  ...sharedProps
}: ValidationProps<T>) => {
  return (
    <ValidationProvider
      {...sharedProps}
      disableIf={disableIf}
      hideIf={hideIf}
      validate={validate}
    >
      {children}
    </ValidationProvider>
  );
};
