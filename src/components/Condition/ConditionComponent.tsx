import React from "react";
import { ConditionComponentType } from "./types";

export const ConditionComponent: ConditionComponentType = ({
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
  }, [controller, customCondition, ifFormValid]);

  return <>{isVisible && children}</>;
};
