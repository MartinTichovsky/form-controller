import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import { wait } from "../../utils/utils";
import { SubmitCustom } from "../SubmitCustom";
import { testErrorMessage } from "../utils/selectors";

console.error = jest.fn();
console.log = jest.fn();

const buttonPendingText = "pending...";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("SubmitCustom", async () => {
  const { container } = render(<SubmitCustom />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // the submit button must not have the pending text
  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // two errors should be shown
  testErrorMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // the submit button must have the pending text
  expect(screen.getByTestId(submitTestId)).toHaveTextContent(buttonPendingText);

  // check the onSubmit action
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // wait for delay
  await act(async () => {
    await wait(2000);
  });

  // after timouet, the submit button must not have the pending text
  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );

  // submit the form to show the pending text again
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // reset the form to unmount the elements and create new ones
  fireEvent.click(screen.getByTestId(resetTestId));

  // wait for delay
  await act(async () => {
    await wait(2000);
  });

  // no console errors should be caused
  expect(console.error).not.toBeCalled();

  // the submit button must not have the pending text
  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );
}, 10000);
