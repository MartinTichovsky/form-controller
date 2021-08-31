import React from "react";
import { Controller, FormFields } from "../controller";

export const MessageFor = <T extends FormFields<T>, K extends keyof T>({
  children,
  controller,
  isValid,
  name
}: React.PropsWithChildren<{
  controller: Controller<T>;
  isValid?: boolean;
  name: K;
}>) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const refIsVisible = React.useRef(isVisible);
  refIsVisible.current = isVisible;

  React.useEffect(() => {
    const onValidate = {
      action: (show: boolean, fieldIsValid: boolean) => {
        if (
          show &&
          ((isValid && fieldIsValid) || (!isValid && !fieldIsValid)) &&
          !refIsVisible.current
        ) {
          setIsVisible(true);
        } else if (
          (!show || (isValid && !fieldIsValid) || (!isValid && fieldIsValid)) &&
          refIsVisible.current
        ) {
          setIsVisible(false);
        }
      },
      key: name
    };

    controller.subscribeOnValidate(onValidate);

    return () => {
      controller.unsubscribeOnValidate(onValidate);
    };
  }, [controller, setIsVisible]);

  return <>{isVisible && children}</>;
};
