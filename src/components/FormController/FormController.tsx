import React from "react";
import { FormFields } from "../../controller";
import { FormControllerComponent } from "./FormControllerComponent";
import { FormControllerComponentProps } from "./types";

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
