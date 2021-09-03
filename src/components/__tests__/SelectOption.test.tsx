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
const selectRef = {
  current: { value: defaultValue }
} as React.MutableRefObject<HTMLSelectElement | undefined>;

beforeEach(() => {
  hooksCollector.reset();
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

const checkUseEffectActions = () => {
  // useEffect should be called one times
  expect(
    hooksCollector
      .getRegisteredComponentHooks(SelectOption.name, "useEffect", testId)
      ?.getRenderHooks(1, 1)?.action
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
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(1);

    checkUseEffectActions();

    // manually run onChange
    controller.onChange();

    // the component should be rendered one times
    expect(
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
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
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(1);

    checkUseEffectActions();

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "some text" });
    });

    // check the render count
    expect(
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
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
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(2);

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "" });
    });

    // option should be disabled
    expect(screen.getByTestId(testId)).toBeDisabled();

    // check the render count
    expect(
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
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
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(1);

    checkUseEffectActions();

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "some text" });
    });

    // check the render count
    expect(
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
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
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(2);

    // set input value
    act(() => {
      controller.setFieldValue({ key: "input", value: "" });
    });

    // option should not be in the document
    expect(() => screen.getByTestId(testId)).toThrowError();

    // check the render count
    expect(
      hooksCollector.getComponentRenderCount(SelectOption.name, testId)
    ).toBe(3);

    await waitFor(async () => {
      expect(controller.getFieldValue("select")).toBe(defaultValue);
    });
  });
});
