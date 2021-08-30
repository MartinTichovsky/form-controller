import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { SelectField } from "../SelectField";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const resetTestId = "reset";
const selectTestId = "select";
const submitTestId = "submit";

test("SelectField", async () => {
  const { container } = render(<SelectField />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error must be shown
  testErrorMessage(container, 1);

  // select an option without a value property
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "Option 1" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    select: "Option 1"
  });

  // select an option with a value property
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "option-3" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    select: "option-3"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "Option 2" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // select an empty option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "" }
  });

  // one error should be shown
  testErrorMessage(container, 1);
});
