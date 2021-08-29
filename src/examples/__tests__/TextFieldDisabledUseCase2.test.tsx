import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDisabledUseCase2 } from "../TextFieldDisabledUseCase2";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldDisabledUseCase2", async () => {
  const { container } = render(<TextFieldDisabledUseCase2 />);

  // the first and the third input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // the first and the third input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: " " }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // all fields must not be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // all fields must not be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: " ",
    surname: "Bond"
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // input a text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "Mr." }
  });

  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));
});
