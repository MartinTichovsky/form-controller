import React, { useEffect } from "react";
import { Controller, FormFields } from "../controller";
import { selectContext } from "../providers";

interface State {
  isDisabled: boolean;
  isVisible: boolean;
}

const afterAll = new Map<
  Controller<any>,
  { action: () => void; queueId: number }
>();

const runAfterAll = <T extends FormFields<T>>(controller: Controller<T>) => {
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

export const SelectOption = <T extends FormFields<T>>({
  children,
  controller,
  disableIf,
  hideIf,
  ...rest
}: React.PropsWithChildren<
  React.OptionHTMLAttributes<HTMLOptionElement> & {
    controller: Controller<T>;
    disableIf?: (fields: Partial<T>) => boolean;
    hideIf?: (fields: Partial<T>) => boolean;
  }
>) => {
  const context = React.useContext(selectContext);
  if (!context) {
    return null;
  }

  const { id, name, selectRef } = context;

  const field = controller.getField(name as keyof T);
  const [state, setState] = React.useState<State>({
    isDisabled: disableIf !== undefined && disableIf(controller.fields),
    isVisible: hideIf === undefined || !hideIf(controller.fields)
  });
  const refState = React.useRef(state);
  const key = React.useRef(0);

  refState.current = state;

  useEffect(() => {
    const action = () => {
      const isDisabled =
        disableIf !== undefined && disableIf(controller.fields);
      const isVisible = hideIf === undefined || !hideIf(controller.fields);

      if (
        refState.current.isDisabled !== isDisabled ||
        refState.current.isVisible !== isVisible
      ) {
        if (!afterAll.has(controller)) {
          afterAll.set(controller, {
            action: () => {
              controller.validateAll(name as keyof T);
            },
            queueId: 1
          });
        } else {
          afterAll.get(controller)!.queueId++;
        }

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

  let setWasCalled = false;

  if (
    (state.isDisabled || !state.isVisible) &&
    field !== undefined &&
    (field.value === children || field.value === rest.value)
  ) {
    setWasCalled = true;
    setTimeout(() => {
      controller.setFieldValue(name as keyof T, selectRef.current?.value, id);
    }, 10);
  }

  if (!setWasCalled) {
    runAfterAll(controller);
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
