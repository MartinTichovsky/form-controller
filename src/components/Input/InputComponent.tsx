import React from "react";
import {
  invalidClassName,
  messageClassName,
  validClassName
} from "../../constants";
import { FormFields, ValidationResult } from "../../controller";
import { InitialState, InputComponentType, InputPrivateProps } from "./types";

type State = {
  message: ValidationResult;
  isSelected: boolean;
} & InitialState;

export const InputComponent = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & InputPrivateProps
  >,
  MComponent extends React.ElementType
>({
  controller,
  disableIf,
  MessageComponent,
  hideMessage,
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
  InputComponentType<T, K, IComponent, MComponent, InitialState>
>) => {
  const [state, setState] = React.useState<State>({
    ...initialState!,
    message: undefined,
    isSelected: controller.getFieldValue(name) === value
  });
  const refState = React.useRef(state);
  const defaultValue = React.useRef(controller.getFieldValue(name) || "");
  const key = React.useRef(0);

  refState.current = state;

  if (rest.type === "radio" && hideMessage === undefined) {
    hideMessage = true;
  }

  React.useEffect(
    () => {
      if (
        rest.type === "radio" &&
        rest.id &&
        controller.getFieldValue(name) === value
      ) {
        controller.setDefaultActiveId(name, rest.id);
      }

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

      const action = (validationResult: ValidationResult) => {
        if (hideMessage) {
          return;
        }

        const field = controller.getField(name);

        if (validationResult) {
          setState((prevState) => ({
            ...prevState,
            isValid: field === undefined || field.isValid,
            message: validationResult
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            isValid: undefined,
            message: undefined
          }));
        }
      };

      controller.subscribeValidator({
        action,
        id: rest.id,
        key: name,
        type: rest.type,
        validate: () => validate(controller.getFieldValue(name), rest)
      });

      return () => {
        controller.unsubscribeValidator(name, action);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, hideMessage, name, setState, validate]
  );

  React.useEffect(
    () => {
      const action = {
        action: (disable: boolean) => {
          setState((prevState) => ({
            ...prevState,
            isDisabled: disable
          }));
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
          key.current++;

          setState((prevState) => ({
            ...prevState,
            message: undefined,
            isDisabled: true,
            isSelected: controller.getFieldValue(name) === value,
            isValid: undefined
          }));
        } else if (!isDisabled && refState.current.isDisabled) {
          setState((prevState) => ({
            ...prevState,
            isDisabled: false
          }));
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
            setState((prevState) => ({
              ...prevState,
              isVisible: false
            }));
          } else if (isVisible && !refState.current.isVisible) {
            key.current++;

            setState((prevState) => ({
              ...prevState,
              isSelected: controller.getFieldValue(name) === value,
              isVisible: true
            }));
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

  React.useEffect(
    () => {
      if (rest.type === "radio" && rest.id) {
        controller.subscribeIsSelected(rest.id, () => {
          key.current++;
          const field = controller.getField(name);

          setState((prevState) => ({
            ...prevState,
            message:
              prevState.message && validate
                ? validate(field?.value as T[K], rest)
                : undefined,
            isSelected: true,
            isValid: field === undefined || field.isValid
          }));
        });

        return () => {
          controller.unsubscribeIsSelected(rest.id!);
        };
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, setState]
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

  const MessageElement = React.useCallback(
    ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLProps<HTMLElement>>) =>
      MessageComponent && typeof MessageComponent === "function" ? (
        <MessageComponent
          {...({
            ...rest,
            ...props
          } as React.ComponentProps<React.ElementType>)}
        >
          {children}
        </MessageComponent>
      ) : (
        <span {...props}>{children}</span>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [MessageComponent]
  );

  if (!state.isVisible) {
    return <></>;
  }

  let props = {
    defaultChecked: false,
    defaultValue: value || (defaultValue.current as string)
  };

  if (rest.type === "radio" && state.isSelected) {
    props.defaultChecked = true;
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
      {state.message && state.message !== true && (
        <MessageElement
          className={`${messageClassName} ${
            state.isValid === false ? invalidClassName : validClassName
          }`}
        >
          {state.message}
        </MessageElement>
      )}
    </>
  );
};
