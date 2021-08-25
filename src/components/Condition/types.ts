import { Controller, FormFields } from "../../controller";

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<{
  controller: Controller<T>;
  customCondition?: () => boolean;
  ifFormValid?: boolean;
}>;

export type ConditionComponentType = <T extends FormFields<T>>({
  children,
  controller,
  customCondition,
  ifFormValid
}: ConditionProps<T>) => JSX.Element;
