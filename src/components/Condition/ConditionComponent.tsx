import React from "react";
import { ConditionComponentState, ConditionComponentType } from "./types";

export const ConditionComponent: ConditionComponentType = ({
  children,
  controller,
  dynamicContent,
  dynamicRender,
  ifFormValid,
  showIf
}) => {
  const [state, setState] = React.useState<ConditionComponentState>({
    isVisible: false
  });
  const refState = React.useRef<ConditionComponentState>();
  refState.current = state;

  const key = React.useRef(0);

  if (dynamicRender) {
    key.current++;
  }

  React.useEffect(() => {
    const action = (isValid: boolean) => {
      const setStateOnNotVisible =
        dynamicRender || dynamicContent || !refState.current!.isVisible;
      const setStateOnVisible =
        dynamicRender || dynamicContent || refState.current!.isVisible;

      if (
        ifFormValid === undefined &&
        showIf === undefined &&
        setStateOnNotVisible
      ) {
        setState({ isVisible: true });
      } else if (ifFormValid !== undefined && showIf === undefined) {
        isValid
          ? setStateOnNotVisible && setState({ isVisible: true })
          : setStateOnVisible && setState({ isVisible: false });
      } else if (ifFormValid === undefined && showIf !== undefined) {
        showIf()
          ? setStateOnNotVisible && setState({ isVisible: true })
          : setStateOnVisible && setState({ isVisible: false });
      } else if (ifFormValid !== undefined && showIf !== undefined) {
        isValid && showIf()
          ? setStateOnNotVisible && setState({ isVisible: true })
          : setStateOnVisible && setState({ isVisible: false });
      }
    };

    controller.subscribeOnChange(action);

    return () => {
      controller.unsubscribeOnChange(action);
    };
  }, [controller, ifFormValid, refState, showIf]);

  return (
    <>
      {state.isVisible &&
        (dynamicContent ? (
          <React.Fragment>{dynamicContent(controller)}</React.Fragment>
        ) : (
          <React.Fragment key={key.current}>{children}</React.Fragment>
        ))}
    </>
  );
};
