import React from "react";
import { FormFields } from "../controller";
import { FieldContainer } from "./Field/FieldContainer";
import { FieldPrivateProps, FieldType } from "./Field/types";

export function Select<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps<HTMLSelectElement>
  >,
  MComponent extends React.ElementType
>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FieldType<
        T,
        K,
        IComponent,
        MComponent,
        HTMLSelectElement,
        React.SelectHTMLAttributes<HTMLSelectElement>
      >
    >
  >
) {
  return (
    <FieldContainer<
      T,
      K,
      IComponent,
      MComponent,
      HTMLSelectElement,
      React.SelectHTMLAttributes<HTMLSelectElement>
    >
      {...props}
      fieldType="select"
    />
  );
}
