import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { Condition } from "../Condition/Condition";
import { ConditionComponent } from "../Condition/ConditionComponent";

type Form = {
  input: string;
};

const testId = "test-id";
let controller: Controller<Form>;

const testValidForm = (unmount: () => void) => {
  const useEffectHooks = collector
    .getReactHooks(ConditionComponent.name)
    ?.getHooksByType("useEffect");

  // Should be rendered once and action should be called, by default is children not rendered
  expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
  expect(useEffectHooks?.get(2)).toBeUndefined();
  expect(() => screen.getByTestId(testId)).toThrowError();

  // onChange is trigered and the form is valid, it should re-render the component and show the children
  controller.onChange();

  expect(collector.getCallCount(ConditionComponent.name)).toBe(2);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
  expect(useEffectHooks?.get(2)).toBeUndefined();
  expect(screen.getByTestId(testId)).toBeTruthy();

  // set form values and make the form invalid, it should hide the children
  controller["_fields"].input = {
    isDisabled: false,
    isValid: false,
    isValidated: true,
    isVisible: true,
    validationInProgress: false,
    validationContent: "error",
    value: undefined
  };

  controller.onChange();
  expect(collector.getCallCount(ConditionComponent.name)).toBe(3);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
  expect(useEffectHooks?.get(2)).toBeUndefined();
  expect(() => screen.getByTestId(testId)).toThrowError();

  // unmount the component
  unmount();

  // unmount action should be called
  expect(useEffectHooks?.get(1)?.unmount).toBeCalledTimes(1);
};

console.error = jest.fn();

beforeEach(() => {
  collector.reset();
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Condition", () => {
  describe("Condition Element", () => {
    test("Providing wrong controller should throw an error", () => {
      const values = getGeneratedValues();

      values.forEach((value) => {
        expect(() => {
          render(<Condition controller={value} />);
        }).toThrowError();
      });
    });

    test("Providing wrong showIf should throw an error", () => {
      const values = getGeneratedValues(false, "function", "undefined");

      values.forEach((value) => {
        expect(() => {
          render(<Condition controller={controller} showIf={value} />);
        }).toThrowError();
      });
    });

    test("Providing wrong dynamicContent should throw an error", () => {
      const values = getGeneratedValues(false, "function", "undefined");

      values.forEach((value) => {
        expect(() => {
          render(<Condition controller={controller} dynamicContent={value} />);
        }).toThrowError();
      });
    });

    test("IfFormValid is undefined and showIf is undefined", () => {
      render(
        <Condition controller={controller}>
          <div data-testid={testId}></div>
        </Condition>
      );

      controller.onChange();
      expect(screen.getByTestId(testId)).toBeTruthy();

      controller["_fields"].input = {
        isDisabled: false,
        isValid: true,
        isValidated: true,
        isVisible: true,
        validationInProgress: false,
        validationContent: undefined,
        value: undefined
      };

      controller.onChange();
      expect(screen.getByTestId(testId)).toBeTruthy();
    });
  });

  describe("ConditionComponent Element", () => {
    test("Default functionality", () => {
      render(
        <ConditionComponent controller={controller}>
          <div data-testid={testId}></div>
        </ConditionComponent>
      );

      expect(() => screen.getByTestId(testId)).toThrowError();
    });

    test("dynamicRender", () => {
      let num = 0;
      const TestComponent = () => {
        return <div data-testid={testId}>{++num}</div>;
      };

      render(
        <ConditionComponent controller={controller} dynamicRender>
          <TestComponent />
        </ConditionComponent>
      );

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("1");

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("2");

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("3");
    });

    test("dynamicContent", () => {
      let num = 0;
      render(
        <ConditionComponent
          controller={controller}
          dynamicContent={() => <div data-testid={testId}>{++num}</div>}
        />
      );

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("1");

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("2");

      controller.onChange();

      expect(screen.getByTestId(testId)).toHaveTextContent("3");
    });

    test("IfFormValid is true and showIf is undefined", () => {
      const { unmount } = render(
        <ConditionComponent controller={controller} ifFormValid>
          <div data-testid={testId}></div>
        </ConditionComponent>
      );

      testValidForm(unmount);
    });

    test("IfFormValid is undefined and showIf is set", () => {
      const showIf = jest.fn(() => {
        return controller.isValid;
      });

      const { unmount } = render(
        <ConditionComponent controller={controller} showIf={showIf}>
          <div data-testid={testId}></div>
        </ConditionComponent>
      );

      testValidForm(unmount);
    });

    test("IfFormValid is true and showIf is set - default", () => {
      const showIf = jest.fn(() => {
        return controller.isValid;
      });

      const { unmount } = render(
        <ConditionComponent controller={controller} ifFormValid showIf={showIf}>
          <div data-testid={testId}></div>
        </ConditionComponent>
      );

      testValidForm(unmount);
    });

    test("IfFormValid is true and showIf is set - custom", () => {
      const showIf = jest.fn(() => {
        return false;
      });

      render(
        <ConditionComponent controller={controller} ifFormValid showIf={showIf}>
          <div data-testid={testId}></div>
        </ConditionComponent>
      );

      expect(() => screen.getByTestId(testId)).toThrowError();

      const useEffectHooks = collector
        .getReactHooks(ConditionComponent.name)
        ?.getHooksByType("useEffect");

      expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
      expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
      expect(() => screen.getByTestId(testId)).toThrowError();

      // the form is not valid because of the custom condition, the component shouldn't re-render
      controller.onChange();
      expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
      expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
      expect(() => screen.getByTestId(testId)).toThrowError();
    });
  });
});
