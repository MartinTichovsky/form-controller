import React, { InputHTMLAttributes } from "react";
import { Controller, FormFields } from "./controller";

interface InputPrivateProps {
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputPublicProps<T extends FormFields<T>, K extends keyof T> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  id?: string;
  name: K;
}

export type InputProps = React.ComponentProps<typeof InputComponent>;

type RestProps<T> = Omit<
  T,
  | "controller"
  | "defaultValue"
  | "disabled"
  | "ErrorComponent"
  | "InputComponent"
  | "name"
  | "onChange"
  | "onKeyDown"
  | "validate"
>;

type InputComponentType = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & InputPrivateProps
  >,
  EComponent extends React.ElementType
>({
  controller,
  disableIf,
  ErrorComponent,
  InputComponent,
  name,
  onFormChange,
  validate,
  ...rest
}: InputPublicProps<T, K> & {
  onFormChange?: (name: K, props: typeof rest) => void;
  validate?: (
    value: string | undefined,
    props: typeof rest
  ) => false | string | null | undefined;
} & (
    | ({
        ErrorComponent: undefined;
        InputComponent: undefined;
      } & RestProps<InputHTMLAttributes<HTMLInputElement>>)
    | ({
        ErrorComponent: EComponent;
        InputComponent: undefined;
      } & RestProps<InputHTMLAttributes<HTMLInputElement>>)
    | ({
        ErrorComponent?: EComponent;
        InputComponent?: IComponent;
      } & RestProps<React.ComponentPropsWithoutRef<IComponent>>)
  )) => JSX.Element;

const InputComponent: InputComponentType = ({
  controller,
  disableIf,
  ErrorComponent,
  InputComponent,
  name,
  onFormChange,
  validate,
  ...rest
}) => {
  const [state, setState] = React.useState<{
    error: false | string | undefined | null;
    isDisabled: boolean;
  }>({ error: undefined, isDisabled: false });
  const defaultValue = React.useRef(controller.getFieldValue(name) || "");
  const isMounted = React.useRef(true);
  const key = React.useRef(0);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(
    () => {
      controller.subscribeValidator(name, (silent) => {
        if (!validate || !isMounted.current) {
          return true;
        }

        const errorMessage = validate(
          controller.getFieldValue(name) as string,
          rest
        );

        if (silent) {
          return !errorMessage;
        }

        if (errorMessage) {
          setState((prevState) => ({ ...prevState, error: errorMessage }));
          return false;
        } else {
          setState((prevState) => ({ ...prevState, error: undefined }));
          return true;
        }
      });

      controller.subscribeOnDisable(name, (disable) => {
        if (isMounted.current) {
          setState((prevState) => ({ ...prevState, isDisabled: disable }));
        }
      });

      return () => {
        controller.unsubscribeOnDisable(name);
        controller.unsubscribeValidator(name);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, name, setState, validate]
  );

  React.useEffect(() => {
    if (disableIf) {
      const action = () => {
        if (!isMounted.current) {
          return;
        }

        if (disableIf(controller.fields) && !state.isDisabled) {
          key.current = key.current + 1;
          controller.setIsDisabled(name, true);
          setState({ error: undefined, isDisabled: true });
        } else {
          controller.setIsDisabled(name, false);
          setState((prevState) => ({ ...prevState, isDisabled: false }));
        }
      };

      controller.subscribeOnChange(action);

      return () => {
        controller.unsubscribeOnChange(action);
      };
    }
  }, [controller, disableIf, key, name, setState]);

  React.useEffect(
    () => {
      if (onFormChange) {
        const action = () => {
          onFormChange(name, rest);
        };

        controller.subscribeOnChange(action);

        return () => {
          controller.unsubscribeOnChange(action);
        };
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, name, onFormChange]
  );

  const InputElement = React.useCallback(
    (props: InputHTMLAttributes<HTMLInputElement>) =>
      InputComponent && typeof InputComponent === "function" ? (
        <InputComponent
          {...({
            ...rest,
            ...props
          } as React.ComponentProps<React.ElementType>)}
        />
      ) : (
        <input {...props} />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [InputComponent]
  );

  const ErrorElement = React.useCallback(
    ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLProps<HTMLElement>>) =>
      ErrorComponent && typeof ErrorComponent === "function" ? (
        <ErrorComponent
          {...({
            ...rest,
            ...props
          } as React.ComponentProps<React.ElementType>)}
        >
          {children}
        </ErrorComponent>
      ) : (
        <span className="input-field-error" {...props}>
          {children}
        </span>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ErrorComponent]
  );

  return (
    <>
      <InputElement
        {...rest}
        disabled={state.isDisabled}
        defaultValue={defaultValue.current as string}
        key={key.current}
        name={name as string}
        onChange={(event) =>
          controller.setFieldValue(name, event.currentTarget.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            controller.submit();
          }
        }}
      />
      {state.error && <ErrorElement>{state.error}</ErrorElement>}
    </>
  );
};

export const Input: InputComponentType = (props) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.disableIf && typeof props.disableIf !== "function") {
    throw new Error("DisableIf is not a function");
  }

  if (!props.name || typeof props.name !== "string") {
    throw new Error("Name must be a string");
  }

  if (props.onFormChange && typeof props.onFormChange !== "function") {
    throw new Error("OnFormChange is not a function");
  }

  if (props.validate && typeof props.validate !== "function") {
    throw new Error("Validate is not a function");
  }

  return <InputComponent {...props} />;
};
