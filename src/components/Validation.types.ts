import { FormFields, ValidationResult } from "../controller.types";
import { CommonFieldProps } from "./Field/types";

export type ValidationProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    disableIf?: (fields: Partial<T>) => boolean;
    hideIf?: (fields: Partial<T>) => boolean;
    validation?: (
      value: string | boolean | undefined,
      props: unknown
    ) => ValidationResult;
  } & CommonFieldProps
>;
