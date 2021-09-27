import React from "react";
import { Controller } from "../controller";
import { FormFields } from "../controller.types";
import { selectContext } from "../providers";
import {
  FormType,
  RegisterAfterAll,
  SelectOptionProps,
  SelectOptionState
} from "./SelectOption.types";

const afterAll = new Map<
  Controller<FormFields<FormType>>,
  { action: () => void; queueId: number }
>();

export const executeAfterAll = async <T extends FormFields<T>>(
  controller: Controller<FormFields<FormType>>
) => {
  if (!afterAll.has(controller)) {
    return;
  }

  const stack = afterAll.get(controller)!;
  stack.queueId--;

  if (stack!.queueId === 0) {
    stack.action();
    afterAll.delete(controller);
  }
};

export const registerAfterAll = ({
  controller,
  id,
  isDisabled,
  isVisible,
  name,
  selectRef,
  value
}: RegisterAfterAll) => {
  let queueId = 1;

  if (afterAll.has(controller)) {
    queueId = ++afterAll.get(controller)!.queueId;
  }

  afterAll.set(controller, {
    action: () => {
      let proceedValidation = true;

      if (selectRef && selectRef.current && selectRef.current.options) {
        proceedValidation =
          Array.prototype.filter.call(
            selectRef.current.options,
            (option) =>
              (option.value === value && !isDisabled && isVisible) ||
              (option.value !== value && option.value && !option.disabled)
          ).length > 0;
      }

      if (proceedValidation) {
        controller.setFieldValue({
          id,
          key: name,
          silent: !controller.canFieldBeValidated(name),
          value: selectRef.current!.value
        });
      } else {
        controller.setFieldValue({
          id,
          isValid: true,
          key: name,
          value: selectRef.current!.value
        });
      }
    },
    queueId
  });
};

export const SelectOption = <T extends FormFields<T>>({
  children,
  controller,
  disableIf,
  hideIf,
  ...rest
}: SelectOptionProps<T>) => {
  const context = React.useContext(selectContext);
  if (
    !context ||
    !context.name ||
    !context.selectRef ||
    !context.selectRef.current
  ) {
    return null;
  }

  const { id, name, selectRef } = context;
  const [state, setState] = React.useState<SelectOptionState>({
    isDisabled: disableIf !== undefined && disableIf(controller.fields),
    isVisible: hideIf === undefined || !hideIf(controller.fields)
  });
  const refState = React.useRef<SelectOptionState>();
  refState.current = state;

  const key = React.useRef(0);

  if (disableIf !== undefined || hideIf !== undefined) {
    React.useEffect(() => {
      const action = () => {
        const isDisabled =
          disableIf !== undefined && disableIf(controller.fields);
        const isVisible = hideIf === undefined || !hideIf(controller.fields);

        if (
          refState.current!.isDisabled !== isDisabled ||
          refState.current!.isVisible !== isVisible
        ) {
          registerAfterAll({
            controller: controller as Controller<FormFields<unknown>>,
            id,
            isDisabled,
            isVisible,
            name,
            selectRef,
            value: rest.value !== undefined ? rest.value : children
          });

          key.current++;
          setState({
            isDisabled,
            isVisible
          });
        }
      };

      controller.subscribeOnChange(action);

      return () => {
        controller.unsubscribeOnChange(action);
      };
    }, [controller, disableIf, hideIf, refState]);
  }

  React.useEffect(() => {
    executeAfterAll(controller as Controller<FormFields<unknown>>);
  }, [state]);

  if (!state.isVisible) {
    return null;
  }

  return (
    <option {...rest} disabled={state.isDisabled} key={key.current}>
      {children}
    </option>
  );
};
