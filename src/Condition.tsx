import React from "react";
import { Controller, FormFields } from "./controller";

export type ConditionProps<T extends FormFields<T>> = React.PropsWithChildren<{
  controller: Controller<T>;
  customCondition?: () => boolean;
  ifFormValid?: boolean;
}>;

type ConditionComponentType = <T extends FormFields<T>>({
  children,
  controller,
  customCondition,
  ifFormValid
}: ConditionProps<T>) => JSX.Element;

const ConditionComponent: ConditionComponentType = ({
  children,
  controller,
  customCondition,
  ifFormValid
}) => {
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

export const Condition: ConditionComponentType = (props) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.customCondition && typeof props.customCondition !== "function") {
    throw new Error("CustomCondition is not a function");
  }

  return <ConditionComponent {...props} />;
};
