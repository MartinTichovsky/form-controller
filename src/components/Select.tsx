import React from "react";
import { FormFields } from "../controller";
import { FieldContainer } from "./Field/FieldContainer";
import { FieldPrivateProps, FieldType } from "./Field/types";

export const Select = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps
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
        React.SelectHTMLAttributes<HTMLSelectElement>
      >
    >
  >
) => <FieldContainer {...props} fieldType="select" />;
