import { FormFields, ValidationResult } from "./controller.types";

export interface SelectProviderProps {
  id?: string;
  name: string;
  selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
}

export type ValidationAction<T> = (
  value: T | undefined,
  props: unknown
) => ValidationResult;

export type ValidationProviderProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  readonly disableIf?: (fields: Partial<T>) => boolean;
  readonly hideIf?: (fields: Partial<T>) => boolean;
  readonly validate?: ValidationAction<T[K]>;
}>;
