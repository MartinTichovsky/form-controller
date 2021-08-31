import React from "react";
import {
  invalidClassName,
  messageClassName,
  validClassName
} from "../../constants";
import { FormFields, ValidationResult } from "../../controller";
import { SelectProvider } from "../../providers";
import {
  FieldInitialProps,
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldPrivateProps,
  FieldType,
  InitialState
} from "./types";

interface State extends InitialState {
  message: ValidationResult;
  isSelected: boolean;
}

export function Field<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> &
      (ElementType extends HTMLInputElement
        ? FieldPrivateInputProps<ElementType>
        : FieldPrivateProps<ElementType>)
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
>({
  children,
  controller,
  disableIf,
  hideMessage,
  hideIf,
  Component,
  label,
  MessageComponent,
  name,
  onFormChange,
  validate,
  value,
  ...rest
}: React.PropsWithChildren<
  React.ComponentProps<
    FieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
  > &
    FieldInternalProps &
    FieldInitialProps
>) {
  const { initialState, fieldType, ...restProps } = rest;
  const [state, setState] = React.useState<State>({
    ...initialState!,
    message: undefined,
    isSelected: controller.getFieldValue(name) === value
  });
  const refState = React.useRef(state);
  const selectRef = React.useRef<HTMLSelectElement>();
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

  if (validate) {
    React.useEffect(
      () => {
        const action = (validationResult: ValidationResult) => {
          if (hideMessage) {
            return;
          }

          const field = controller.getField(name);

          if (validationResult) {
            setState((prevState) => ({
              ...prevState,
              isValid:
                field === undefined ||
                (field.validationInProgress ? undefined : field.isValid),
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
          validate: () => {
            let proceedValidation = true;

            if (selectRef && selectRef.current && selectRef.current.options) {
              proceedValidation =
                Array.prototype.filter.call(
                  selectRef.current.options,
                  (option) => option.value && !option.disabled
                ).length > 0;
            }

            return (
              proceedValidation &&
              validate(controller.getFieldValue(name), rest)
            );
          }
        });

        return () => {
          controller.unsubscribeValidator(name, action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, hideMessage, name, setState, validate]
    );
  }

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

  if (disableIf) {
    React.useEffect(() => {
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
    }, [controller, disableIf, key, name, refState, setState]);
  }

  if (onFormChange) {
    React.useEffect(
      () => {
        const action = () => {
          onFormChange(name, rest);
        };

        controller.subscribeOnChange(action);

        return () => {
          controller.unsubscribeOnChange(action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, name, onFormChange]
    );
  }

  if (hideIf) {
    React.useEffect(
      () => {
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
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, hideIf, setState]
    );
  }

  if (rest.type === "radio" && rest.id) {
    React.useEffect(
      () => {
        controller.subscribeIsSelected(rest.id!, () => {
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
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, setState]
    );
  }

  if (fieldType === "select") {
    React.useEffect(
      () => {
        controller.setFieldValue(name, selectRef.current?.value, rest.id);
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, selectRef]
    );
  }

  const ComponentElement = React.useCallback(
    (props: React.ComponentProps<React.ElementType>) =>
      fieldType === "select" ? (
        Component ? (
          <Component {...restProps} {...props} ref={selectRef}>
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={selectRef}
            >
              {children}
            </SelectProvider>
          </Component>
        ) : (
          <select {...restProps} {...props} ref={selectRef}>
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={selectRef}
            >
              {children}
            </SelectProvider>
          </select>
        )
      ) : Component ? (
        <Component {...restProps} {...props}>
          {children}
        </Component>
      ) : (
        <input {...props} />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Component, fieldType]
  );

  const MessageElement = React.useCallback(
    ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLProps<HTMLElement>>) =>
      MessageComponent ? (
        <MessageComponent
          {...({
            ...restProps,
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
    return null;
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
      <ComponentElement
        {...restProps}
        {...props}
        disabled={state.isDisabled}
        key={key.current}
        name={name as string}
        onChange={(event: React.ChangeEvent<{ value: string }>) =>
          controller.setFieldValue(name, event.currentTarget.value, rest.id)
        }
        onKeyDown={(event: React.KeyboardEvent) => {
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
          className={
            state.isValid === undefined
              ? messageClassName
              : `${messageClassName} ${
                  state.isValid === false ? invalidClassName : validClassName
                }`
          }
        >
          {state.message}
        </MessageElement>
      )}
    </>
  );
}
