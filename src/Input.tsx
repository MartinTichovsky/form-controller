import React, { InputHTMLAttributes } from "react";
import { Controller, FormFields } from "./controller";

interface InputPrivateProps {
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

export type InputProps = React.ComponentProps<typeof Input>;

type RestProps<T> = Omit<
  T,
  | "controller"
  | "disabled"
  | "ErrorComponent"
  | "InputComponent"
  | "name"
  | "onChange"
  | "onKeyDown"
  | "validate"
>;

export const Input = <
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
  )) => {
  const [state, setState] = React.useState<{
    error: false | string | undefined | null;
    isDisabled: boolean;
  }>({ error: undefined, isDisabled: false });
  const key = React.useRef<number>(0);

  React.useEffect(
    () => {
      controller.subscribeVaidator(name, (silent) => {
        if (!validate || controller.getField(name)?.isDisabled) {
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

      return () => {
        controller.unsubscribeVaidator(name);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, name, setState, validate]
  );

  React.useEffect(() => {
    if (disableIf) {
      const action = () => {
        if (disableIf(controller.fields) && !state.isDisabled) {
          controller.setIsDisabled(name, true);
          key.current = key.current + 1;
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
        key={key.current}
        name={name as string}
        onChange={(event) =>
          controller.setFieldValue(name, event.currentTarget.value as T[K])
        }
        onKeyDown={(event) => {
          if (event.key === "Enter" && controller.onSubmit) {
            controller.onSubmit();
          }
        }}
      />
      {state.error && <ErrorElement>{state.error}</ErrorElement>}
    </>
  );
};
