import React from "react";
import { FormHTMLAttributes } from "react";
import { Controller, FormFields, OnSubmit } from "./controller";

export type FormControllerProps<T extends FormFields<T>> =
  React.PropsWithChildren<{
    initialValues?: T;
    children: (controller: Controller<T>) => React.ReactNode;
    onSubmit?: OnSubmit<T>;
    validateOnChange?: boolean;
  }>;

type FormControllerComponentProps<T extends FormFields<T>> =
  FormControllerProps<T> &
    Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

const FormControllerComponent = <T extends FormFields<T>>({
  children,
  initialValues,
  onSubmit,
  validateOnChange = false,
  ...rest
}: FormControllerComponentProps<T>) => {
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
      controller.onChange();
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

export const FormController = <T extends FormFields<T>>(
  props: FormControllerComponentProps<T>
) => {
  if (
    (props.initialValues && typeof props.initialValues !== "object") ||
    props.initialValues === null
  ) {
    throw new Error("InitialValues values must be an object");
  }

  if (props.onSubmit && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <FormControllerComponent {...props} />;
};
