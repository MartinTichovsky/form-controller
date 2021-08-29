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
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    const onMessage = {
      action: (showMessage: boolean, fieldIsValid: boolean) => {
        if (
          showMessage &&
          (isValid === undefined || isValid === fieldIsValid)
        ) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
      },
      key: name
    };

    controller.subscribeOnValidateMessage(onMessage);

    return () => {
      controller.unsubscribeOnValidateMessage(onMessage);
    };
  }, [controller, setShowMessage]);

  return <>{showMessage && children}</>;
};
