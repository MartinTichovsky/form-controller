import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { wait } from "../../utils/utils";
import { GeneralAsynchronousValidation } from "../GeneralAsynchronousValidation";
import { testInvalidMessage, testValidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const pendingText = "pending...";
const resetTestId = "reset";
const submitTestId = "submit";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("GeneralAsynchronousValidation", () => {
  test("Submit without touch the inputs", async () => {
    const { container } = render(<GeneralAsynchronousValidation />);

    // errors should not be shown
    testInvalidMessage(container, 0);

    // submit invalid form
    fireEvent.click(screen.getByTestId(submitTestId));

    // errors should not be shown
    testInvalidMessage(container, 0);

    // two pending texts should be shown
    expect(screen.getAllByText(pendingText).length).toBe(2);

    // wait for the validation result
    await act(async () => {
      await wait(2000);
    });

    // two errors should be shown
    testInvalidMessage(container, 2);

    // reset the form
    fireEvent.click(screen.getByTestId(resetTestId));

    // errors should not be shown
    testInvalidMessage(container, 0);
  });

  test("Input values", async () => {
    const { container } = render(<GeneralAsynchronousValidation />);

    // input a valid text
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    // wait for the validation result
    await act(async () => {
      await wait(2000);
    });

    // one valid message should be shown
    testValidMessage(container, 1);

    // no error should be shown
    testInvalidMessage(container, 0);

    // no pending text should be shown
    expect(() => screen.getAllByText(pendingText).length).toThrowError();

    // input a valid text
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    // wait for the validation result
    await act(async () => {
      await wait(2000);
    });

    // two valid messages should be shown
    testValidMessage(container, 2);

    // no error should be shown
    testInvalidMessage(container, 0);

    // submit valid form
    fireEvent.click(screen.getByTestId(submitTestId));

    // check the onSubmit action
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });
  });

  test("Click on the submit during validation pending", async () => {
    render(<GeneralAsynchronousValidation />);

    // input a valid text
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    await act(async () => {
      await wait(500);
    });

    // submit invalid form
    fireEvent.click(screen.getByTestId(submitTestId));

    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // two pending texts should be shown
    expect(screen.getAllByText(pendingText).length).toBe(2);

    await act(async () => {
      await wait(2000);
    });

    // check the onSubmit action
    expect(console.log).not.toBeCalled();

    // reset the form
    fireEvent.click(screen.getByTestId(resetTestId));

    // input a valid text
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });

    // input a valid text
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    // submit invalid form
    fireEvent.click(screen.getByTestId(submitTestId));

    // check the onSubmit action
    expect(console.log).not.toBeCalled();

    await act(async () => {
      await wait(2100);
    });

    // check the onSubmit action
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });
  });

  test("Multiple inputs", async () => {
    const { container } = render(<GeneralAsynchronousValidation />);

    // input a valid text
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "J" }
    });

    await act(async () => {
      await wait(1000);
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "Ja" }
    });

    await act(async () => {
      await wait(1000);
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "Jam" }
    });

    await act(async () => {
      await wait(1000);
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "" }
    });

    await act(async () => {
      await wait(1000);
    });

    // a pending text should be shown
    expect(screen.getAllByText(pendingText).length).toBe(1);

    await act(async () => {
      await wait(1000);
    });

    // one error message should be shown
    testInvalidMessage(container, 1);
  }, 10000);
});
