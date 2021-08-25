import React from "react";
import { ValidationProvider } from "../providers";

export const Validation = ({
  children,
  validate
}: React.PropsWithChildren<{
  validate: (
    value: string | undefined,
    props: unknown
  ) => false | string | null | undefined;
}>) => {
  return (
    <ValidationProvider validation={validate}>{children}</ValidationProvider>
  );
};
