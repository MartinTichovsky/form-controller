import React from "react";
import { FormFields, ValidationResult } from "../controller.types";
import { ValidationProvider } from "../providers";

export const Validation = <T extends FormFields<T>>({
  children,
  disableIf,
  hideIf,
  validate
}: React.PropsWithChildren<{
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  validate?: (
    value: string | boolean | undefined,
    props: unknown
  ) => ValidationResult;
}>) => {
  return (
    <ValidationProvider
      disableIf={disableIf}
      hideIf={hideIf}
      validate={validate}
    >
      {children}
    </ValidationProvider>
  );
};
