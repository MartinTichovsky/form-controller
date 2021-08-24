import React from "react";
import { Controller, FormFields } from "../controller";

export const ErrorFor = <T extends FormFields<T>, K extends keyof T>({
  children,
  controller,
  name
}: React.PropsWithChildren<{
  controller: Controller<T>;
  name: K;
}>) => {
  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    const onError = {
      action: (showError: boolean) => {
        if (showError) {
          setShowError(true);
        } else {
          setShowError(false);
        }
      },
      key: name
    };

    controller.subscribeOnError(onError);

    return () => {
      controller.unsubscribeOnError(onError);
    };
  }, [controller, setShowError]);

  return <>{showError && children}</>;
};
