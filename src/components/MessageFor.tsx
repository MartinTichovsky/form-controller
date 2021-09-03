import React from "react";
import { FormFields, ValidationContentResult } from "../controller.types";
import { MessageForProps, MessageForState } from "./MessageFor.types";

export const MessageFor = <T extends FormFields<T>, K extends keyof T>({
  children,
  controller,
  isValid,
  name
}: MessageForProps<T, K>) => {
  const [state, setState] = React.useState<MessageForState>({
    message: undefined,
    isVisible: false
  });
  const refState = React.useRef<MessageForState>();
  refState.current = state;

  React.useEffect(() => {
    const onValidation = {
      action: (
        show: boolean,
        fieldIsValid: boolean,
        validationResult: ValidationContentResult
      ) => {
        if (
          show &&
          ((isValid && fieldIsValid) || (!isValid && !fieldIsValid)) &&
          (!refState.current!.isVisible ||
            (!children && refState.current!.message !== validationResult))
        ) {
          setState({ isVisible: true, message: validationResult });
        } else if (
          (!show || (isValid && !fieldIsValid) || (!isValid && fieldIsValid)) &&
          refState.current!.isVisible
        ) {
          setState({ isVisible: false, message: undefined });
        }
      },
      key: name
    };

    controller.subscribeOnValidation(onValidation);

    return () => {
      controller.unsubscribeOnValidation(onValidation);
    };
  }, [controller, refState, setState]);

  return <>{state.isVisible && (children ? children : state.message)}</>;
};
