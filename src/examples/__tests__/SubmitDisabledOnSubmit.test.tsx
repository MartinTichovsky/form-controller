import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { SubmitDisabledOnSubmit } from "../SubmitDisabledOnSubmit";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitBottomTestId = "submit-bottom";
const submitTopTestId = "submit-top";

test("SubmitDisabledOnSubmit", async () => {
  const { container } = render(<SubmitDisabledOnSubmit />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitBottomTestId));
  });

  // the buttons must be still disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // two errors should be shown
  testInvalidMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // input an empty value, the `validateOnChange` option is false, the empty value shouldn't cause an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // input an empty value, the `validateOnChange` option is false, the empty value shouldn't cause an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitBottomTestId));
  });

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // two errors should be shown
  testInvalidMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTopTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitBottomTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });
});
