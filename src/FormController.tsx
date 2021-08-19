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

/* @internal */
export { FormControllerComponent };

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
      const controller = new Controller<T>({
        initialValues,
        onSubmit,
        setController,
        validateOnChange
      });
      setController(controller);
      controller.onChange();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [setController, validateOnChange]
  );

  if (controller === undefined) {
    return null;
  }

  return (
    <form
      {...rest}
      aria-label="form"
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
    props.initialValues !== undefined &&
    (typeof props.initialValues !== "object" ||
      props.initialValues === null ||
      Array.isArray(props.initialValues))
  ) {
    throw new Error("InitialValues values must be an object");
  }

  if (props.onSubmit !== undefined && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <FormControllerComponent {...props} />;
};
