import React from "react";
import { FormFields } from "../controller";
import { FieldContainer } from "./Field/FieldContainer";
import { FieldPrivateProps, FieldType } from "./Field/types";

export const Input = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps
  >,
  MComponent extends React.ElementType
>(
  props: React.ComponentProps<
    FieldType<
      T,
      K,
      IComponent,
      MComponent,
      React.InputHTMLAttributes<HTMLInputElement>
    >
  >
) => <FieldContainer {...props} fieldType="input" />;
