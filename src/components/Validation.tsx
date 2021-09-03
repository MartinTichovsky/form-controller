import React from "react";
import { FormFields } from "../controller.types";
import { ValidationProvider } from "../providers";
import { ValidationProps } from "./Validation.types";

export const Validation = <T extends FormFields<T>>({
  children,
  disableIf,
  hideIf,
  validation,
  ...sharedProps
}: ValidationProps<T>) => {
  return (
    <ValidationProvider
      {...sharedProps}
      disableIf={disableIf}
      hideIf={hideIf}
      validation={validation}
    >
      {children}
    </ValidationProvider>
  );
};
