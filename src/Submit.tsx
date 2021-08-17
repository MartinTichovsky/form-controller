import React from "react";
import { ButtonHTMLAttributes } from "react";
import { Controller, FormFields, OnSubmit } from "./controller";

interface SubmitPrivateProps<T extends FormFields<T>> {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Controller<T>;
}

export type SubmitProps<T extends FormFields<T>> = React.PropsWithChildren<
  {
    controller: Controller<T>;
    disabledByDefault?: boolean;
    disableIfNotValid?: boolean;
    onSubmit?: OnSubmit<T>;
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSubmit">
>;

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

type SubmitComponentType = <
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
>({
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
      } & RestProps<ButtonHTMLAttributes<HTMLButtonElement>>)
    | ({
        ButtonComponent?: BComponent;
      } & RestProps<React.ComponentProps<BComponent>>)
  )) => JSX.Element;

const SubmitComponent: SubmitComponentType = ({
  ButtonComponent,
  children,
  controller,
  disabledByDefault = false,
  disableIfNotValid = false,
  onSubmit,
  ...rest
}) => {
  const [disabled, setDisable] = React.useState(
    disabledByDefault && disableIfNotValid
  );
  const isMounted = React.useRef(true);

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
    controller.submit();

    if (onSubmit) {
      onSubmit(controller.fields, controller);
    }

    return controller;
  };

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (disableIfNotValid) {
      const onChangeAction = (isValid: boolean) => {
        if (isMounted.current) {
          setDisable(isValid === false);
        }
      };

      controller.subscribeOnChange(onChangeAction);

      return () => {
        controller.unsubscribeOnChange(onChangeAction);
      };
    }
  }, [controller, disableIfNotValid, setDisable]);

  React.useEffect(() => {
    const onDisableAction = (disable: boolean) => {
      if (isMounted.current) {
        setDisable(disable);
      }
    };

    controller.subscribeOnDisableButton(onDisableAction);

    return () => {
      controller.unsubscribeOnDisableButton(onDisableAction);
    };
  }, [controller, setDisable]);

  return (
    <ButtonElement {...rest} disabled={disabled} onClick={handleClick}>
      {children}
    </ButtonElement>
  );
};

export const Submit: SubmitComponentType = (props) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.onSubmit && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <SubmitComponent {...props} />;
};
