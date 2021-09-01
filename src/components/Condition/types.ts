import { Controller } from "../../controller";
import { FormFields } from "../../controller.types";

export type ConditionComponentType = <T extends FormFields<T>>({
  children,
  controller,
  ifFormValid,
  showIf
}: ConditionProps<T>) => JSX.Element;

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    controller: Controller<T>;
    ifFormValid?: boolean;
    showIf?: () => boolean;
  } & (
    | {
        dynamicContent?: (controller: Controller<T>) => JSX.Element;
        dynamicRender?: undefined;
      }
    | { dynamicContent?: undefined; dynamicRender?: boolean }
  )
>;

export interface ConditionComponentState {
  isVisible: boolean;
}
