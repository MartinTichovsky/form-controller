import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDefaultValuesUseCase2 } from "../TextFieldDefaultValuesUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldDefaultValuesUseCase2", async () => {
  const { container } = render(<TextFieldDefaultValuesUseCase2 />);

  // the first input must have default value
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("");

  // first input should be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // no input should be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();

  // input a value
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James Junior" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James Junior",
    surname: "Bond"
  });

  // input an empty value should show an error and reset the first input
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "" }
  });

  // the first input must have default value
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("");

  // one error should be shown
  testInvalidMessage(container, 1);

  // first input should be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // no errors should be shown
  testInvalidMessage(container, 0);

  // input a value
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a value
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // no errors should be shown
  testInvalidMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input a value
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James Junior" }
  });

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // no input should be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();

  fireEvent.click(screen.getByTestId(resetTestId));

  // the first input must have default value
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("");

  // first input should be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });
});
