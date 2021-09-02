import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldValidationDependencies } from "../TextFieldValidationDependencies";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();
console.warn = jest.fn();

const error1TestId = "error-1";
const error2TestId = "error-2";
const error3TestId = "error-3";

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

const testSuite = async (
  container: HTMLElement,
  submitForValidation: boolean = true
) => {
  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // check the onSubmit action
    expect(console.warn).not.toBeCalled();

    // three errors should be shown
    testInvalidMessage(container, 3);

    // all errors should be shown
    expect(screen.getByTestId(error1TestId)).toBeTruthy();
    expect(screen.getByTestId(error2TestId)).toBeTruthy();
    expect(screen.getByTestId(error3TestId)).toBeTruthy();
  }

  // input a text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // three errors should be shown
  testInvalidMessage(container, 3);

  // all errors should be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.warn).not.toBeCalled();

  // input a text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // first error should be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.warn).not.toBeCalled();

  // input a text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Ronald" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    middleName: "Ronald",
    surname: "Bond"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // three errors should be shown
    testInvalidMessage(container, 3);

    // all errors should be shown
    expect(screen.getByTestId(error1TestId)).toBeTruthy();
    expect(screen.getByTestId(error2TestId)).toBeTruthy();
    expect(screen.getByTestId(error3TestId)).toBeTruthy();
  }

  // input a text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // input a text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Ronald" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // one error should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // input a text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });
  }

  // input a text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Ronald" }
  });

  // two errors should  be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // input a text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // two errors should  be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // input a text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("TextFieldValidationDependencies", () => {
  test("Validation on submit", async () => {
    const { container } = render(<TextFieldValidationDependencies />);
    await testSuite(container);
  });

  test("Validation on change", async () => {
    const { container } = render(
      <TextFieldValidationDependencies validateOnChange />
    );

    await testSuite(container, false);
  });
});
