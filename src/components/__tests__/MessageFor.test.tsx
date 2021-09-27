import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { MessageFor } from "../MessageFor";

type Form = {
  input: string;
};

const testText1 = "Test text 1";
const testText2 = "Test text 2";
let controller: Controller<Form>;

beforeEach(() => {
  collector.reset();
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });

  controller["_fields"].input = {
    isDisabled: false,
    isValid: true,
    isValidated: true,
    isVisible: true,
    validationInProgress: false,
    validationContent: undefined,
    value: undefined
  };
});

const checkUseEffectActions = () => {
  // useEffect should be called one times
  expect(
    collector
      .getReactHooks(MessageFor.name)
      ?.getHooksByType("useEffect")
      ?.get(1)?.action
  ).toBeCalledTimes(1);

  // the unmount action should not to be called
  expect(
    collector
      .getReactHooks(MessageFor.name)
      ?.getHooksByType("useEffect")
      ?.get(1)?.unmount
  ).not.toBeCalled();

  // more useEffects should not exist
  expect(
    collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect").get(2)
  ).toBeUndefined();
};

describe("MessageFor", () => {
  test("Default functionality - isValid is undefined, equal to false", () => {
    const { unmount } = render(
      <MessageFor controller={controller} name="input">
        {testText1}
      </MessageFor>
    );

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // the component should be rendered one times
    expect(collector.getCallCount(MessageFor.name)).toBe(1);

    checkUseEffectActions();

    // the controller should have registered one onValidateMessage listener
    expect(controller["onValidationListeners"].size).toBe(1);

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(1);

    checkUseEffectActions();

    controller["_fields"].input!.isValid = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document because form is not submited and validateOnChange is false
    expect(() => screen.getByText(testText1)).toThrowError();

    controller["_validateOnChange"] = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText1)).toBeTruthy();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(2);

    checkUseEffectActions();

    controller["_validateOnChange"] = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(3);

    checkUseEffectActions();

    controller["_isSubmitted"] = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText1)).toBeTruthy();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(4);

    checkUseEffectActions();

    controller["_fields"].input!.isDisabled = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(5);

    checkUseEffectActions();

    controller["_fields"].input!.isDisabled = false;
    controller["_fields"].input!.isVisible = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(5);

    checkUseEffectActions();

    unmount();

    // the unmount action should be called
    expect(
      collector
        .getReactHooks(MessageFor.name)
        ?.getHooksByType("useEffect")
        ?.get(1)?.unmount
    ).toBeCalled();
  });

  test("IsValid is true, show message only for valid fields", () => {
    const { unmount } = render(
      <MessageFor controller={controller} isValid={true} name="input">
        {testText1}
      </MessageFor>
    );

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // the component should be rendered one times
    expect(collector.getCallCount(MessageFor.name)).toBe(1);

    checkUseEffectActions();

    // the controller should have registered one onValidationMessage listener
    expect(controller["onValidationListeners"].size).toBe(1);

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(1);

    checkUseEffectActions();

    controller["_validateOnChange"] = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText1)).toBeTruthy();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(2);

    checkUseEffectActions();

    controller["_validateOnChange"] = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(3);

    checkUseEffectActions();

    controller["_isSubmitted"] = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText1)).toBeTruthy();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(4);

    checkUseEffectActions();

    controller["_fields"].input!.isValid = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(5);

    checkUseEffectActions();

    controller["_fields"].input!.isValid = true;
    controller["_fields"].input!.isDisabled = true;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(5);

    checkUseEffectActions();

    controller["_fields"].input!.isDisabled = false;
    controller["_fields"].input!.isVisible = false;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // check render count
    expect(collector.getCallCount(MessageFor.name)).toBe(5);

    checkUseEffectActions();

    unmount();

    // the unmount action should be called
    expect(
      collector
        .getReactHooks(MessageFor.name)
        ?.getHooksByType("useEffect")
        ?.get(1)?.unmount
    ).toBeCalled();
  });

  test("Passing text from validation", () => {
    render(<MessageFor controller={controller} isValid={true} name="input" />);

    controller["_fields"].input!.validationContent = testText1;
    controller["_validateOnChange"] = true;

    // the test message should not be in the document
    expect(() => screen.getByText(testText1)).toThrowError();

    // the component should be rendered one times
    expect(collector.getCallCount(MessageFor.name)).toBe(1);

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText1)).toBeTruthy();

    controller["_fields"].input!.validationContent = testText2;

    // manually call private method
    act(() => {
      controller["validationListeners"]("input");
    });

    // the test message should be in the document
    expect(screen.getByText(testText2)).toBeTruthy();
  });
});
