import React from "react";
import { Submit, SubmitComponent } from "../Submit";
import { Controller } from "../controller";
import { fireEvent, render, screen } from "@testing-library/react";
import { getGeneratedValues } from "./utils/value-generator";
import { ReactHooksCollector } from "./utils/react-hooks-collector";
import "@testing-library/jest-dom";

type Form = {
  input: string;
};

const buttonText = "Test text";
let controller: Controller<Form>;
let hooksCollector: ReactHooksCollector;

// mocking react to get statistics from calling hooks
jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const {
    mockReactHooks,
    ReactHooksCollector
  } = require("./utils/react-hooks-collector");
  hooksCollector = new ReactHooksCollector();

  return mockReactHooks(origin, hooksCollector);
});

// mocking the component to get statistics of render count
jest.mock("../Submit", () => {
  const origin = jest.requireActual("../Submit");
  const { mockComponent } = require("./utils/clone-function");

  return {
    ...origin,
    SubmitComponent: mockComponent(
      origin,
      origin.SubmitComponent.name,
      hooksCollector
    )
  };
});

const defaultFunctionalityTest = (unmount: () => void) => {
  // button should contain the text and shouldn't be disabled
  const button = screen.getByText(buttonText);
  expect(button).not.toBeDisabled();

  const useCallbackHooks = hooksCollector.getRegisteredComponentHook(
    SubmitComponent.name,
    "useCallback"
  );
  const useEffectHooks = hooksCollector.getRegisteredComponentHook(
    SubmitComponent.name,
    "useEffect"
  );

  // render and call count
  expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).toBeUndefined();
  expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 2)?.unmountAction).not.toBeCalled();

  // onSubmit is not provided, click on the button should do nothing
  fireEvent.click(button);

  expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).toBeUndefined();
  expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 2)?.unmountAction).not.toBeCalled();

  // unmout the component
  unmount();

  expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).toBeUndefined();
  expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 2)?.unmountAction).toBeCalledTimes(
    1
  );
};

console.error = jest.fn();

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Submit Element", () => {
  test("Default functionality", () => {
    render(<Submit controller={controller}>{buttonText}</Submit>);

    expect(screen.getByText(buttonText)).toBeTruthy();
  });

  test("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();

    values.forEach((value) => {
      expect(() => {
        render(<Submit controller={value} />);
      }).toThrowError();
    });
  });

  test("Providing wrong onSubmit should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(<Submit controller={controller} onSubmit={value} />);
      }).toThrowError();
    });
  });
});

describe("SubmitComponent Element", () => {
  test("Default functionality", () => {
    hooksCollector.reset();

    const { unmount } = render(
      <SubmitComponent controller={controller}>{buttonText}</SubmitComponent>
    );

    defaultFunctionalityTest(unmount);
  });

  test("DisabledByDefault is set to true and disableIfNotValid is false, the behaviour must be the same as default", () => {
    hooksCollector.reset();

    const { unmount } = render(
      <SubmitComponent controller={controller} disabledByDefault>
        {buttonText}
      </SubmitComponent>
    );

    defaultFunctionalityTest(unmount);
  });

  test("DisabledByDefault is true and disableIfNotValid is true", () => {
    hooksCollector.reset();

    const { unmount } = render(
      <SubmitComponent
        controller={controller}
        disabledByDefault
        disableIfNotValid
      >
        {buttonText}
      </SubmitComponent>
    );

    // button should contain the text and should be disabled
    const button = screen.getByText(buttonText);
    expect(button).toBeDisabled();

    const useEffectHooks = hooksCollector.getRegisteredComponentHook(
      SubmitComponent.name,
      "useEffect"
    );

    // render and call count
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      1
    );
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 1)?.unmountAction
    ).not.toBeCalled();
    expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 2)?.unmountAction
    ).not.toBeCalled();

    // when onChange is triggered and the form is valid, the button should be enabled
    controller.onChange();

    expect(button).not.toBeDisabled();
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      2
    );
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 1)?.unmountAction
    ).not.toBeCalled();
    expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 2)?.unmountAction
    ).not.toBeCalled();

    // all other hooks mustn't be called
    const registeredHooks = hooksCollector.getRegisteredComponentHooks(
      SubmitComponent.name
    );

    // unmout the component
    unmount();

    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      2
    );
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
    expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).toBeCalledTimes(
      1
    );
    expect(useEffectHooks?.getRenderHooks(1, 2)?.action).toBeCalledTimes(1);
    expect(useEffectHooks?.getRenderHooks(1, 2)?.unmountAction).toBeCalledTimes(
      1
    );

    registeredHooks
      ?.map((hook) => hook.useEffect)
      .flat()
      ?.slice(3)
      .forEach((renderHook) => {
        if (renderHook) {
          expect(renderHook.action).not.toBeCalled();
        }
      });
  });

  test("OnSubmit is provided", () => {
    hooksCollector.reset();

    const onSubmit = jest.fn();

    render(
      <SubmitComponent controller={controller} onSubmit={onSubmit}>
        {buttonText}
      </SubmitComponent>
    );

    expect(onSubmit).not.toBeCalled();

    const button = screen.getByText(buttonText);
    fireEvent.click(button);

    expect(onSubmit).toBeCalledTimes(1);
  });

  test("On disable action triggered from controller should disable the button", () => {
    hooksCollector.reset();

    render(
      <SubmitComponent controller={controller}>{buttonText}</SubmitComponent>
    );

    const button = screen.getByText(buttonText);
    expect(button).not.toBeDisabled();

    // disable fields manualy
    controller.disableFields(true);

    expect(button).toBeDisabled();
  });

  test("On disable action triggered from controller should disable the button", () => {
    hooksCollector.reset();
    const testid = "test-id";

    const onSubmit = jest.fn();

    const ButtonComponent = (props: any) => {
      return (
        <button data-testid={testid} {...props}>
          {props.children}
        </button>
      );
    };

    render(
      <SubmitComponent
        ButtonComponent={ButtonComponent}
        controller={controller}
        onSubmit={onSubmit}
      >
        {buttonText}
      </SubmitComponent>
    );

    expect(onSubmit).not.toBeCalled();

    // button with test id must exist
    const button = screen.getByTestId(testid);
    expect(button).not.toBeDisabled();
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      1
    );

    // test disability
    controller.disableFields(true);
    expect(button).toBeDisabled();
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      2
    );

    // click should not trigger onSubmit
    fireEvent.click(button);
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      2
    );

    // enable button to be able click
    controller.disableFields(false);
    expect(hooksCollector.getComponentRenderCount(SubmitComponent.name)).toBe(
      3
    );

    // click on the button must call onSubmit
    fireEvent.click(button);
    expect(onSubmit).toBeCalledTimes(1);
  });
});
