import React from "react";
import { Condition, ConditionComponent } from "../Condition";
import { Controller } from "../controller";
import { render, screen } from "@testing-library/react";
import { getGeneratedValues } from "./utils/value-generator";
import { ReactHooksCollector } from "./utils/react-hooks-collector";

type Form = {
  input: string;
};

const testid = "test-id";
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
jest.mock("../Condition", () => {
  const origin = jest.requireActual("../Condition");
  const { mockComponent } = require("./utils/clone-function");

  return {
    ...origin,
    ConditionComponent: mockComponent(
      origin,
      origin.ConditionComponent.name,
      hooksCollector
    )
  };
});

const testValidForm = (unmount: () => void) => {
  const useEffectHooks = hooksCollector.getRegisteredComponentHook(
    ConditionComponent.name,
    "useEffect"
  );
  const registeredHooks = hooksCollector.getRegisteredComponentHooks(
    ConditionComponent.name
  );

  // Should be rendered once and action should be called, by default is children not rendered
  expect(hooksCollector.getComponentRenderCount(ConditionComponent.name)).toBe(
    1
  );
  expect(useEffectHooks?.getRender(1)?.length).toBe(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).not.toBeCalled();
  expect(() => screen.getByTestId(testid)).toThrowError();

  // onChange is trigered and the form is valid, it should re-render the component and show the children
  controller.onChange();

  expect(hooksCollector.getComponentRenderCount(ConditionComponent.name)).toBe(
    2
  );
  expect(useEffectHooks?.getRender(1)?.length).toBe(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).not.toBeCalled();
  expect(screen.getByTestId(testid)).toBeTruthy();

  // set form values and make the form invalid, it should hide the children
  controller["_fields"].input = {
    isDisabled: false,
    isValid: false,
    value: undefined
  };

  controller.onChange();
  expect(hooksCollector.getComponentRenderCount(ConditionComponent.name)).toBe(
    3
  );
  expect(useEffectHooks?.getRender(1)?.length).toBe(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).not.toBeCalled();
  expect(() => screen.getByTestId(testid)).toThrowError();

  // for each all hooks except for the first
  registeredHooks
    ?.map((hook) => hook.useEffect)
    .flat()
    ?.slice(1)
    .forEach((renderHook) => {
      if (renderHook) {
        expect(renderHook.action).not.toBeCalled();
      }
    });

  // unmount the component
  unmount();

  // unmount action should be called
  expect(useEffectHooks?.getRenderHooks(1, 1)?.unmountAction).toBeCalledTimes(
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

describe("Condition Element", () => {
  test("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();

    values.forEach((value) => {
      expect(() => {
        render(<Condition controller={value} />);
      }).toThrowError();
    });
  });

  test("Providing wrong customCondition should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(<Condition controller={controller} customCondition={value} />);
      }).toThrowError();
    });
  });

  test("IfFormValid is undefined and customCondition is undefined", () => {
    render(
      <Condition controller={controller}>
        <div data-testid={testid}></div>
      </Condition>
    );

    controller.onChange();
    expect(screen.getByTestId(testid)).toBeTruthy();

    controller["_fields"].input = {
      isDisabled: false,
      isValid: true,
      value: undefined
    };

    controller.onChange();
    expect(screen.getByTestId(testid)).toBeTruthy();
  });
});

describe("ConditionComponent Element", () => {
  test("Default functionality", () => {
    hooksCollector.reset();

    render(
      <ConditionComponent controller={controller}>
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    expect(() => screen.getByTestId(testid)).toThrowError();
  });

  test("IfFormValid is true and customCondition is undefined", () => {
    hooksCollector.reset();

    const { unmount } = render(
      <ConditionComponent controller={controller} ifFormValid>
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    testValidForm(unmount);
  });

  test("IfFormValid is undefined and customCondition is set", () => {
    hooksCollector.reset();

    const customCondition = jest.fn(() => {
      return controller.isValid;
    });

    const { unmount } = render(
      <ConditionComponent
        controller={controller}
        customCondition={customCondition}
      >
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    testValidForm(unmount);
  });

  test("IfFormValid is true and customCondition is set - default", () => {
    hooksCollector.reset();

    const customCondition = jest.fn(() => {
      return controller.isValid;
    });

    const { unmount } = render(
      <ConditionComponent
        controller={controller}
        ifFormValid
        customCondition={customCondition}
      >
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    testValidForm(unmount);
  });

  test("IfFormValid is true and customCondition is set - custom", () => {
    hooksCollector.reset();

    const customCondition = jest.fn(() => {
      return false;
    });

    render(
      <ConditionComponent
        controller={controller}
        ifFormValid
        customCondition={customCondition}
      >
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    expect(() => screen.getByTestId(testid)).toThrowError();

    const useEffectHooks = hooksCollector.getRegisteredComponentHook(
      ConditionComponent.name,
      "useEffect"
    );

    expect(
      hooksCollector.getComponentRenderCount(ConditionComponent.name)
    ).toBe(1);
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 1)?.unmountAction
    ).not.toBeCalled();
    expect(() => screen.getByTestId(testid)).toThrowError();

    // the form is not valid because of the custom condition, the component shouldn't re-render
    controller.onChange();
    expect(
      hooksCollector.getComponentRenderCount(ConditionComponent.name)
    ).toBe(1);
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
    expect(
      useEffectHooks?.getRenderHooks(1, 1)?.unmountAction
    ).not.toBeCalled();
    expect(() => screen.getByTestId(testid)).toThrowError();
  });
});
