import React from "react";
import { Condition, ConditionComponent } from "../Condition";
import { Controller } from "../controller";
import { render, screen } from "@testing-library/react";
import { getGeneratedValues } from "./utils/value-generator";
import { Hooks } from "./utils/hook-mock";

type Form = {
  input: string;
};

const testid = "test-id";
let controller: Controller<Form>;
let hooks: Hooks;

jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const { Hooks, mockReactHooks } = require("./utils/hook-mock");
  hooks = new Hooks();

  return mockReactHooks(origin, hooks);
});

jest.mock("../Condition", () => {
  const origin = jest.requireActual("../Condition");
  const { mockComponent } = require("./utils/clone-function");

  return {
    ...origin,
    ConditionComponent: mockComponent(origin, "ConditionComponent", hooks)
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Condition", () => {
  beforeEach(() => {
    console.error = jest.fn();
    const setController = jest.fn();
    controller = new Controller<Form>({ setController });
  });

  it("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();
    values.forEach((value) => {
      expect(() => {
        render(<Condition controller={value} />);
      }).toThrowError();
    });
  });

  it("Providing wrong customCondition should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");
    values.forEach((value) => {
      expect(() => {
        render(<Condition controller={controller} customCondition={value} />);
      }).toThrowError();
    });
  });

  it("Default - ifFormValid is undefined and customCondition is undefined", () => {
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

  const testComponentValidForm = (unmount: () => void) => {
    const renderHooks = hooks.getHook("ConditionComponent", "useEffect");

    expect(renderHooks?.length).toBe(1);
    expect(renderHooks?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0].unmountAction).not.toBeCalled();

    controller.onChange();
    expect(renderHooks?.length).toBe(2);
    expect(renderHooks?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0].unmountAction).not.toBeCalled();

    expect(screen.getByTestId(testid)).toBeTruthy();

    controller["_fields"].input = {
      isDisabled: false,
      isValid: false,
      value: undefined
    };

    controller.onChange();
    expect(renderHooks?.length).toBe(3);
    expect(renderHooks?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0].unmountAction).not.toBeCalled();
    expect(() => screen.getByTestId(testid)).toThrowError();

    renderHooks?.slice(1).forEach((hook) => {
      expect(hook.action).not.toBeCalled();
    });

    unmount();

    expect(renderHooks?.[0].unmountAction).toBeCalledTimes(1);
    hooks.reset();
  };

  it("Default - ifFormValid is true and customCondition is undefined", () => {
    const { unmount } = render(
      <ConditionComponent controller={controller} ifFormValid>
        <div data-testid={testid}></div>
      </ConditionComponent>
    );

    testComponentValidForm(unmount);
  });

  it("Default - ifFormValid is undefined and customCondition is set", () => {
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

    testComponentValidForm(unmount);
  });

  it("Default - ifFormValid is true and customCondition is set - default", () => {
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

    testComponentValidForm(unmount);
  });

  it("Default - ifFormValid is true and customCondition is set - custom", () => {
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

    const renderHooks = hooks.getHook("ConditionComponent", "useEffect");

    expect(renderHooks?.length).toBe(1);
    expect(renderHooks?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0].unmountAction).not.toBeCalled();

    controller.onChange();
    expect(renderHooks?.length).toBe(1);
    expect(renderHooks?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0].unmountAction).not.toBeCalled();

    expect(() => screen.getByTestId(testid)).toThrowError();
  });
});
