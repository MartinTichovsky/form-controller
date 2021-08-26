import React from "react";
import { ConditionComponentType } from "./types";

export const ConditionComponent: ConditionComponentType = ({
  children,
  controller,
  ifFormValid,
  showIf
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const action = (isValid: boolean) => {
      if (ifFormValid === undefined && !showIf) {
        setIsVisible(true);
      }
      if (ifFormValid !== undefined && !showIf) {
        isValid ? setIsVisible(true) : setIsVisible(false);
      }
      if (ifFormValid === undefined && showIf) {
        showIf() ? setIsVisible(true) : setIsVisible(false);
      }
      if (ifFormValid !== undefined && showIf) {
        isValid && showIf() ? setIsVisible(true) : setIsVisible(false);
      }
    };

    controller.subscribeOnChange(action);

    return () => {
      controller.unsubscribeOnChange(action);
    };
  }, [controller, ifFormValid, showIf]);

  return <>{isVisible && children}</>;
};
