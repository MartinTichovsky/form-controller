import React from "react";
import { Controller, FormFields } from "./controller";

export type ConditionProps<T> = React.PropsWithChildren<{
  controller: Controller<T>;
  customCondition?: () => boolean;
  ifFormValid?: boolean;
}>;

export const Condition = <T extends FormFields<T>>({
  children,
  controller,
  customCondition,
  ifFormValid
}: ConditionProps<T>) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const action = (isValid: boolean) => {
      if (ifFormValid === undefined && !customCondition) {
        setIsVisible(true);
      }
      if (ifFormValid !== undefined && !customCondition) {
        isValid ? setIsVisible(true) : setIsVisible(false);
      }
      if (ifFormValid === undefined && customCondition) {
        customCondition() ? setIsVisible(true) : setIsVisible(false);
      }
      if (ifFormValid !== undefined && customCondition) {
        isValid && customCondition() ? setIsVisible(true) : setIsVisible(false);
      }
    };

    controller.subscribeOnChange(action);

    return () => {
      controller.unsubscribeOnChange(action);
    };
  }, [controller, customCondition, ifFormValid, isVisible]);

  return <>{isVisible && children}</>;
};
