import { Controller, FormFields, OnSubmit } from "../../controller";

type RestProps<T> = Omit<
  T,
  | "ButtonComponent"
  | "controller"
  | "disabled"
  | "disabledByDefault"
  | "disableIfNotValid"
  | "onClick"
  | "onSubmit"
  | "type"
>;

export interface SubmitComponentType<
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
> {
  ({
    ButtonComponent,
    children,
    controller,
    disabledByDefault,
    disableIfNotValid,
    onSubmit,
    ...rest
  }: SubmitProps<T> &
    (
      | ({
          ButtonComponent: undefined;
        } & RestProps<React.ButtonHTMLAttributes<HTMLButtonElement>>)
      | ({
          ButtonComponent?: BComponent;
        } & RestProps<React.ComponentProps<BComponent>>)
    )): JSX.Element;
}

export interface SubmitPrivateProps<T extends FormFields<T>> {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<T>;
}

export type SubmitProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    controller: Controller<T>;
    disabledByDefault?: boolean;
    disableIfNotValid?: boolean;
    onSubmit?: OnSubmit<T>;
  } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSubmit">
>;
