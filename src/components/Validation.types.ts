import { FormFields, ValidationResult } from "../controller.types";

export type ValidationProps<T extends FormFields<T>> = React.PropsWithChildren<{
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  validate?: (
    value: string | boolean | undefined,
    props: unknown
  ) => ValidationResult;
}>;
