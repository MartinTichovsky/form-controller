import { FormFields, ValidationResult } from "./controller.types";

export interface SelectProviderProps {
  id?: string;
  name: string;
  selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
}

export type ValidationAction<T, E = unknown, P = unknown> = (
  value: T | undefined,
  fields: Partial<E>,
  props: P
) => ValidationResult;

export type ValidationProviderProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  readonly disableIf?: (fields: Partial<T>) => boolean;
  readonly hideIf?: (fields: Partial<T>) => boolean;
  readonly hideMessage?: boolean;
  readonly hideRequiredStar?: boolean;
  readonly required?: boolean;
  readonly requiredComponent?: JSX.Element;
  readonly validate?: ValidationAction<T[K]>;
}>;
