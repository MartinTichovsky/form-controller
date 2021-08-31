import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<{
  controller: Controller<T>;
  ifFormValid?: boolean;
  showIf?: () => boolean;
}>;

export type ConditionComponentType = <T extends FormFields<T>>({
  children,
  controller,
  ifFormValid,
  showIf
}: ConditionProps<T>) => JSX.Element;
