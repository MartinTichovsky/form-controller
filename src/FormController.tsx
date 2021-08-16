import React from "react";
import { FormHTMLAttributes } from "react";
import { Controller, FormFields, OnSubmit } from "./controller";

export type FormControllerProps<T> = React.PropsWithChildren<{
  initialValues?: T;
  children: (controller: Controller<T>) => React.ReactNode;
  onSubmit?: OnSubmit<T>;
  validateOnChange?: boolean;
}>;

export const FormController = <T extends FormFields<T>>({
  children,
  initialValues,
  onSubmit,
  validateOnChange = false,
  ...rest
}: FormControllerProps<T> &
  Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">) => {
  const [controller, setController] = React.useState<Controller<T>>();

  React.useEffect(
    () => {
      setController(
        new Controller<T>({
          initialValues,
          onSubmit,
          setController,
          validateOnChange
        })
      );
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [setController, validateOnChange]
  );

  React.useEffect(() => {
    if (controller) {
      controller.fireOnChange();
    }
  }, [controller]);

  if (controller === undefined) {
    return null;
  }

  return (
    <form
      {...rest}
      onSubmit={(event) => event.preventDefault()}
      key={controller.key}
    >
      {children(controller)}
    </form>
  );
};
