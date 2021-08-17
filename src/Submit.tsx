import React from "react";
import { ButtonHTMLAttributes } from "react";
import { Controller, FormFields } from "./controller";

interface SubmitPrivateProps<T> {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<T>;
}

export type SubmitProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    controller: Controller<T>;
    disabledByDefault?: boolean;
    disableIfNotValid?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

type RestProps<T> = Omit<
  T,
  | "ButtonComponent"
  | "controller"
  | "disabled"
  | "disabledByDefault"
  | "disableIfNotValid"
  | "onClick"
  | "type"
>;

export const Submit = <
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
>({
  ButtonComponent,
  children,
  controller,
  disabledByDefault = false,
  disableIfNotValid = false,
  ...rest
}: SubmitProps<T> &
  (
    | ({
        ButtonComponent: undefined;
      } & RestProps<ButtonHTMLAttributes<HTMLButtonElement>>)
    | ({
        ButtonComponent?: BComponent;
      } & RestProps<React.ComponentProps<BComponent>>)
  )) => {
  const [disabled, setDisable] = React.useState(
    disabledByDefault && disableIfNotValid
  );

  const ButtonElement = React.useCallback(
    (props: React.PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) =>
      ButtonComponent && typeof ButtonComponent === "function" ? (
        <ButtonComponent
          {...({
            ...rest,
            ...props
          } as React.ComponentProps<React.ElementType>)}
        />
      ) : (
        <button {...props} type="button">
          {props.children}
        </button>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ButtonComponent]
  );

  const handleClick = () => {
    return controller.onSubmit();
  };

  React.useEffect(() => {
    if (disableIfNotValid) {
      const action = (isValid: boolean) => {
        setDisable(isValid === false);
      };

      controller.subscribeOnChange(action);

      return () => {
        controller.unsubscribeOnChange(action);
      };
    }
  }, [controller, disableIfNotValid, setDisable]);

  return (
    <ButtonElement {...rest} disabled={disabled} onClick={handleClick}>
      {children}
    </ButtonElement>
  );
};
