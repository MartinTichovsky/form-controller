import { ValidationResult, Value } from "./controller.types";

export type OnChangeCondition = ((fields: {}) => boolean) | undefined;

export interface SelectProviderProps {
  id?: string;
  name: string;
  selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
}

export type ValidationAction = (
  value: Value,
  fields: {},
  props: {}
) => ValidationResult;

export interface ValidationProviderProps {
  readonly disableIf?: OnChangeCondition;
  readonly hideIf?: OnChangeCondition;
  readonly hideMessage?: boolean;
  readonly hideRequiredStar?: boolean;
  readonly required?: boolean;
  readonly requiredComponent?: JSX.Element;
  readonly validation?: ValidationAction;
}
