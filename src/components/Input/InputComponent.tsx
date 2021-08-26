import React from "react";
import { errorClassName } from "../../constants";
import { FormFields, ValidationResult } from "../../controller";
import { InitialState, InputComponentType, InputPrivateProps } from "./types";

type State = {
  error: ValidationResult;
  isDisabled: boolean;
  isVisible: boolean;
};

export const InputComponent = <
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
  hideError,
  hideIf,
  initialState,
  InputComponent,
  label,
  name,
  onFormChange,
  validate,
  value,
  ...rest
}: React.ComponentProps<
  InputComponentType<T, K, IComponent, EComponent, InitialState>
>) => {
  const [state, setState] = React.useState<State>({
    ...initialState!,
    error: undefined
  });
  const refState = React.useRef(state);
  const defaultValue = React.useRef(controller.getFieldValue(name) || "");
  const key = React.useRef(0);

  refState.current = state;

  if (rest.type === "radio" && hideError === undefined) {
    hideError = true;
  }

  React.useEffect(
    () => {
      return () => {
        controller.deleteField(name, rest.id);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller]
  );

  React.useEffect(
    () => {
      if (!validate) {
        return;
      }

      const action = (errorMessage: ValidationResult) => {
        if (hideError) {
          return;
        }

        if (errorMessage) {
          setState((prevState) => ({ ...prevState, error: errorMessage }));
        } else {
          setState((prevState) => ({ ...prevState, error: undefined }));
        }
      };

      controller.subscribeValidator({
        action,
        id: rest.id,
        key: name,
        type: rest.type,
        validate: () => validate!(controller.getFieldValue(name), rest)
      });

      return () => {
        controller.unsubscribeValidator(name, action);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, hideError, name, setState, validate]
  );

  React.useEffect(
    () => {
      const action = {
        action: (disable: boolean) => {
          setState((prevState) => ({ ...prevState, isDisabled: disable }));
        },
        key: name
      };

      controller.subscribeOnDisable(action);

      return () => {
        controller.unsubscribeOnDisable(action);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, name, setState]
  );

  React.useEffect(() => {
    if (disableIf) {
      const action = () => {
        const isDisabled = disableIf(controller.fields);

        controller.setIsDisabled({
          id: rest.id,
          isDisabled,
          key: name,
          type: rest.type
        });

        if (isDisabled && !refState.current.isDisabled) {
          key.current = key.current + 1;
          defaultValue.current = controller.getFieldValue(name) || "";

          setState((prevState) => ({
            ...prevState,
            error: undefined,
            isDisabled: true
          }));
        } else if (!isDisabled && refState.current.isDisabled) {
          setState((prevState) => ({ ...prevState, isDisabled: false }));
        }
      };

      controller.subscribeOnChange(action);

      return () => {
        controller.unsubscribeOnChange(action);
      };
    }
  }, [controller, disableIf, key, name, refState, setState]);

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

  React.useEffect(
    () => {
      if (hideIf) {
        const action = () => {
          const isVisible = !hideIf(controller.fields);

          controller.setIsVisible({
            id: rest.id,
            isVisible,
            key: name,
            type: rest.type
          });

          if (!isVisible && refState.current.isVisible) {
            setState((prevState) => ({ ...prevState, isVisible: false }));
          } else if (isVisible && !refState.current.isVisible) {
            setState((prevState) => ({ ...prevState, isVisible: true }));
          }
        };

        controller.subscribeOnChange(action);

        return () => {
          controller.unsubscribeOnChange(action);
        };
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, hideIf, setState]
  );

  const InputElement = React.useCallback(
    (props: React.InputHTMLAttributes<HTMLInputElement>) =>
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
        <span className={errorClassName} {...props}>
          {children}
        </span>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ErrorComponent]
  );

  if (!state.isVisible) {
    return <></>;
  }

  let props = {
    defaultChecked: false,
    defaultValue: value || (defaultValue.current as string)
  };

  if (
    defaultValue.current &&
    rest.type === "radio" &&
    defaultValue.current === value
  ) {
    controller.setDefaultActiveId(name, rest.id);
    props.defaultChecked = true;
    defaultValue.current = "";
  }

  return (
    <>
      {rest.type !== "radio" &&
        (typeof label === "string" ? (
          <>
            <label htmlFor={rest.id}>{label}</label>{" "}
          </>
        ) : (
          label
        ))}
      <InputElement
        {...rest}
        {...props}
        disabled={state.isDisabled}
        key={key.current}
        name={name as string}
        onChange={(event) =>
          controller.setFieldValue(name, event.currentTarget.value, rest.id)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            controller.submit();
          }
        }}
      />
      {rest.type === "radio" &&
        (typeof label === "string" ? (
          <>
            {" "}
            <label htmlFor={rest.id}>{label}</label>
          </>
        ) : (
          label
        ))}
      {state.error && state.error !== true && (
        <ErrorElement>{state.error}</ErrorElement>
      )}
    </>
  );
};
