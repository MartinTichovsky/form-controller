import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { Submit } from "../Submit/Submit";
import { SubmitComponent } from "../Submit/SubmitComponent";

type Form = {
  input: string;
};

const buttonText = "Test text";
let controller: Controller<Form>;

const defaultFunctionalityTest = async (
  unmount: () => void,
  disabledByDefault?: boolean
) => {
  // button should contain the text and shouldn't be disabled
  const button = screen.getByText(buttonText);

  if (disabledByDefault) {
    expect(button).toBeDisabled();
  } else {
    expect(button).not.toBeDisabled();
  }

  const useCallbackHooks = collector
    .getReactHooks(SubmitComponent.name)
    ?.getHooksByType("useCallback");
  const useEffectHooks = collector
    .getReactHooks(SubmitComponent.name)
    ?.getHooksByType("useEffect");

  // render and call count
  expect(collector.getCallCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).toBeUndefined();
  expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(2)?.unmount).not.toBeCalled();

  // onSubmit is not provided, click on the button should do nothing
  await waitFor(async () => {
    fireEvent.click(button);
  });

  expect(collector.getCallCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).toBeUndefined();
  expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(2)?.unmount).not.toBeCalled();

  // unmout the component
  unmount();

  expect(collector.getCallCount(SubmitComponent.name)).toBe(1);
  expect(useCallbackHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(1)?.unmount).toBeUndefined();
  expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
  expect(useEffectHooks?.get(2)?.unmount).toBeCalledTimes(1);
};

console.error = jest.fn();

beforeEach(() => {
  collector.reset();
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Submit", () => {
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
    test("Default functionality", async () => {
      const { unmount } = render(
        <SubmitComponent controller={controller}>{buttonText}</SubmitComponent>
      );

      await defaultFunctionalityTest(unmount);
    });

    test("DisabledByDefault is set to true and disableIfNotValid is false, the behaviour must be the same as default", async () => {
      const { unmount } = render(
        <SubmitComponent controller={controller} disabledByDefault>
          {buttonText}
        </SubmitComponent>
      );

      await defaultFunctionalityTest(unmount, true);
    });

    test("DisabledByDefault is true and disableIfNotValid is true", () => {
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

      const useEffectHooks = collector
        .getReactHooks(SubmitComponent.name)
        ?.getHooksByType("useEffect");

      // render and call count
      expect(collector.getCallCount(SubmitComponent.name)).toBe(1);
      expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
      expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(2)?.unmount).not.toBeCalled();

      // when onChange is triggered and the form is valid, the button should be enabled
      controller.onChange();

      expect(button).not.toBeDisabled();
      expect(collector.getCallCount(SubmitComponent.name)).toBe(2);
      expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
      expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(2)?.unmount).not.toBeCalled();

      // all other hooks mustn't be called
      const registeredHooks = collector.getCallCount(SubmitComponent.name);

      // unmout the component
      unmount();

      expect(collector.getCallCount(SubmitComponent.name)).toBe(2);
      expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(1)?.unmount).toBeCalledTimes(1);
      expect(useEffectHooks?.get(2)?.action).toBeCalledTimes(1);
      expect(useEffectHooks?.get(2)?.unmount).toBeCalledTimes(1);
    });

    test("OnSubmit is provided", async () => {
      const onSubmit = jest.fn();

      render(
        <SubmitComponent controller={controller} onSubmit={onSubmit}>
          {buttonText}
        </SubmitComponent>
      );

      expect(onSubmit).not.toBeCalled();

      const button = screen.getByText(buttonText);

      await waitFor(async () => {
        fireEvent.click(button);
      });

      expect(onSubmit).toBeCalledTimes(1);
    });

    test("On disable action triggered from controller should disable the button - use case 1", () => {
      render(
        <SubmitComponent controller={controller}>{buttonText}</SubmitComponent>
      );

      const button = screen.getByText(buttonText);
      expect(button).not.toBeDisabled();

      // disable fields manualy
      controller.disableFields(true);

      expect(button).toBeDisabled();
    });

    test("On disable action triggered from controller should disable the button - use case 2", async () => {
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
      expect(collector.getCallCount(SubmitComponent.name)).toBe(1);

      // test disability
      controller.disableFields(true);

      expect(button).toBeDisabled();
      expect(collector.getCallCount(SubmitComponent.name)).toBe(2);

      // click should not trigger onSubmit
      await waitFor(async () => {
        fireEvent.click(button);
      });

      expect(collector.getCallCount(SubmitComponent.name)).toBe(2);

      // enable button to be able click
      controller.disableFields(false);
      expect(collector.getCallCount(SubmitComponent.name)).toBe(3);

      // click on the button must call onSubmit
      await waitFor(async () => {
        fireEvent.click(button);
      });

      expect(onSubmit).toBeCalledTimes(1);
    });
  });
});
