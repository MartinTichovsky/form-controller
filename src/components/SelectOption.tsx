import React from "react";
import { Controller } from "../controller";
import { FormFields } from "../controller.types";
import { selectContext } from "../providers";
import {
  FormType,
  SelectOptionProps,
  SelectOptionState
} from "./SelectOption.types";

const afterAll = new Map<
  Controller<FormFields<FormType>>,
  { action: () => void; queueId: number }
>();

const executeAfterAll = <T extends FormFields<T>>(
  controller: Controller<FormFields<FormType>>
) => {
  if (!afterAll.has(controller)) {
    return;
  }

  const stack = afterAll.get(controller)!;
  stack.queueId--;

  if (stack!.queueId === 0) {
    setTimeout(() => {
      stack.action();
      afterAll.delete(controller);
    }, 10);
  }
};

const registerAfterAll = (
  name: string,
  controller: Controller<FormFields<FormType>>
) => {
  if (!afterAll.has(controller)) {
    afterAll.set(controller, {
      action: () => {
        controller.validateAll(name);
      },
      queueId: 1
    });
  } else {
    afterAll.get(controller)!.queueId++;
  }
};

export const SelectOption = <T extends FormFields<T>>({
  children,
  controller,
  disableIf,
  hideIf,
  ...rest
}: SelectOptionProps<T>) => {
  const context = React.useContext(selectContext);
  if (!context || !context.name || !context.selectRef) {
    return null;
  }

  const { id, name, selectRef } = context;
  const field = controller.getField(name as keyof T);
  const [state, setState] = React.useState<SelectOptionState>({
    isDisabled: disableIf !== undefined && disableIf(controller.fields),
    isVisible: hideIf === undefined || !hideIf(controller.fields)
  });
  const refState = React.useRef<SelectOptionState>();
  refState.current = state;

  const key = React.useRef(0);

  React.useEffect(() => {
    const action = () => {
      const isDisabled =
        disableIf !== undefined && disableIf(controller.fields);
      const isVisible = hideIf === undefined || !hideIf(controller.fields);

      if (
        refState.current!.isDisabled !== isDisabled ||
        refState.current!.isVisible !== isVisible
      ) {
        registerAfterAll(name, controller as Controller<FormFields<unknown>>);

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

  if (
    (state.isDisabled || !state.isVisible) &&
    field !== undefined &&
    (field.value === children || field.value === rest.value) &&
    selectRef.current !== undefined
  ) {
    setTimeout(() => {
      controller.setFieldValue({
        id,
        key: name as keyof T,
        value: selectRef.current!.value
      });
    }, 10);
  } else {
    executeAfterAll(controller as Controller<FormFields<unknown>>);
  }

  if (!state.isVisible) {
    return null;
  }

  return (
    <option {...rest} disabled={state.isDisabled} key={key.current}>
      {children}
    </option>
  );
};
