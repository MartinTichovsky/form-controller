import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { SelectFieldComponent } from "../SelectFieldComponent";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const classSelectId = "class-select";
const functionalSelectId = "functional-select";
const resetTestId = "reset";
const select1TestId = "select-1";
const select2TestId = "select-2";
const submitTestId = "submit";

test("SelectFieldComponent", async () => {
  const { container } = render(<SelectFieldComponent />);

  // the selects with this id must be in the document
  expect(container.querySelector(`#${classSelectId}`)).toBeTruthy();
  expect(container.querySelector(`#${functionalSelectId}`)).toBeTruthy();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // two errors must be shown
  testErrorMessage(container, 2);

  // select an option without a value property
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "Option 1-1" }
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // select an option without a value property
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "Option 2-1" }
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
    select1: "Option 1-1",
    select2: "Option 2-1"
  });

  // select an option with a value property
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "option-1-3" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // select an option with a value property
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "option-2-3" }
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
    select1: "option-1-3",
    select2: "option-2-3"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "Option 1-2" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "Option 2-2" }
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
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "" }
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // select an empty option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "" }
  });

  // two errors should be shown
  testErrorMessage(container, 2);
});
