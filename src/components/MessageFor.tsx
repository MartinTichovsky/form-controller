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
  const refShowMessage = React.useRef(showMessage);
  refShowMessage.current = showMessage;

  React.useEffect(() => {
    const onMessage = {
      action: (showMessage: boolean, fieldIsValid: boolean) => {
        if (
          showMessage &&
          ((isValid === undefined && !fieldIsValid) ||
            isValid === fieldIsValid) &&
          !refShowMessage.current
        ) {
          setShowMessage(true);
        } else if (refShowMessage.current) {
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
