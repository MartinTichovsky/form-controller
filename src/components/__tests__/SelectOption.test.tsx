import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { SelectProvider } from "../../providers";
import { SelectOption } from "../SelectOption";

type Form = {
  input: string;
  select: string;
};

let controller: Controller<Form>;
const defaultValue = "default value";
const testId = "test-id";
const testText = "Test text";
let selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;

beforeEach(() => {
  collector.reset();
  jest.resetAllMocks();

  const setController = jest.fn();

  controller = new Controller<Form>({ setController });
  selectRef = {
    current: { value: defaultValue }
  } as React.MutableRefObject<HTMLSelectElement | undefined>;
});

const checkUseEffectActions = () => {
  // useEffect should be called one times
  expect(
    collector
      .getReactHooks(SelectOption.name, {
        dataTestId: testId
      })
      ?.getHooksByType("useEffect")
      ?.get(1)?.action
  ).toBeCalledTimes(1);
};

describe("SelectOption", () => {
  test("Context is not provided", () => {
    render(
      <SelectOption controller={controller} data-testid={testId}>
        {testText}
      </SelectOption>
    );

    // option should not be in the document
    expect(() => screen.getByTestId(testId)).toThrowError();
  });

  test("Default functionality", () => {
    render(
      <SelectProvider name="select" selectRef={selectRef}>
        <SelectOption controller={controller} data-testid={testId}>
          {testText}
        </SelectOption>
      </SelectProvider>
    );

    // option should not be disabled
    expect(screen.getByTestId(testId)).not.toBeDisabled();
    expect(controller.getFieldValue("select")).toBeUndefined();

    // the component should be rendered one times
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(1);

    checkUseEffectActions();

    // manually run onChange
    controller.onChange();

    // the component should be rendered one times
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(1);

    checkUseEffectActions();

    // option should not be disabled
    expect(screen.getByTestId(testId)).not.toBeDisabled();
    expect(controller.getFieldValue("select")).toBeUndefined();
  });

  test("DisableIf", async () => {
    render(
      <SelectProvider name="select" selectRef={selectRef}>
        <SelectOption
          controller={controller}
          data-testid={testId}
          disableIf={(fields) => !fields.input?.trim()}
        >
          {testText}
        </SelectOption>
      </SelectProvider>
    );

    // option should be disabled
    expect(screen.getByTestId(testId)).toBeDisabled();

    // the component should be rendered one times
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(1);

    checkUseEffectActions();

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "some text" });
    });

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(2);

    checkUseEffectActions();

    // option should not be disabled
    expect(screen.getByTestId(testId)).not.toBeDisabled();

    // set select value
    act(() => {
      controller.setFieldValue({ key: "select", value: testText });
    });

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(2);

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "" });
    });

    // option should be disabled
    expect(screen.getByTestId(testId)).toBeDisabled();

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(3);

    await waitFor(async () => {
      expect(controller.getFieldValue("select")).toBe(defaultValue);
    });
  });

  test("HideIf", async () => {
    render(
      <SelectProvider name="select" selectRef={selectRef}>
        <SelectOption
          controller={controller}
          data-testid={testId}
          hideIf={(fields) => !fields.input?.trim()}
        >
          {testText}
        </SelectOption>
      </SelectProvider>
    );

    // option should not be in the document
    expect(() => screen.getByTestId(testId)).toThrowError();

    // the component should be rendered one times
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(1);

    checkUseEffectActions();

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "some text" });
    });

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(2);

    checkUseEffectActions();

    // option should be in the document
    expect(screen.getByTestId(testId)).toBeTruthy();

    // set select value
    act(() => {
      controller.setFieldValue({ key: "select", value: testText });
    });

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(2);

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "" });
    });

    // option should not be in the document
    expect(() => screen.getByTestId(testId)).toThrowError();

    // check the render count
    expect(
      collector.getCallCount(SelectOption.name, { dataTestId: testId })
    ).toBe(3);

    await waitFor(async () => {
      expect(controller.getFieldValue("select")).toBe(defaultValue);
    });
  });

  test("registerAfterAll with more options", () => {
    const originSetFieldValue = controller.setFieldValue;

    controller.setFieldValue = jest.fn((...props) =>
      originSetFieldValue.call(controller, ...props)
    );

    render(
      <SelectProvider name="select" selectRef={selectRef}>
        <select ref={selectRef as React.RefObject<HTMLSelectElement>}>
          <option></option>
          <SelectOption
            controller={controller}
            hideIf={(fields) => !fields.input}
          >
            Option 1
          </SelectOption>
          <SelectOption
            controller={controller}
            hideIf={(fields) => !fields.input}
          >
            {testText}
          </SelectOption>
        </select>
      </SelectProvider>
    );

    expect(controller.setFieldValue).toBeCalledTimes(0);

    act(() => {
      originSetFieldValue.call(controller, {
        key: "input",
        value: "value"
      });
    });

    expect(controller.setFieldValue).toHaveBeenCalledTimes(1);
    expect(controller.setFieldValue).lastCalledWith({
      key: "select",
      silent: true,
      value: ""
    });

    act(() => {
      originSetFieldValue.call(controller, {
        key: "input",
        value: ""
      });
    });

    expect(controller.setFieldValue).toHaveBeenCalledTimes(2);
    expect(controller.setFieldValue).lastCalledWith({
      isValid: true,
      key: "select",
      value: ""
    });
  });

  test("registerAfterAll with single option", () => {
    const originSetFieldValue = controller.setFieldValue;

    controller.setFieldValue = jest.fn((...props) =>
      originSetFieldValue.call(controller, ...props)
    );

    render(
      <SelectProvider name="select" selectRef={selectRef}>
        <select ref={selectRef as React.RefObject<HTMLSelectElement>}>
          <SelectOption
            controller={controller}
            hideIf={(fields) => !fields.input}
          >
            {testText}
          </SelectOption>
        </select>
      </SelectProvider>
    );

    expect(controller.setFieldValue).toBeCalledTimes(0);

    act(() => {
      originSetFieldValue.call(controller, {
        key: "input",
        value: "value"
      });
    });

    expect(controller.setFieldValue).toHaveBeenCalledTimes(1);
    expect(controller.setFieldValue).lastCalledWith({
      key: "select",
      silent: true,
      value: testText
    });

    act(() => {
      originSetFieldValue.call(controller, {
        key: "input",
        value: ""
      });
    });

    expect(controller.setFieldValue).toHaveBeenCalledTimes(2);
    expect(controller.setFieldValue).lastCalledWith({
      isValid: true,
      key: "select",
      value: ""
    });
  });
});
