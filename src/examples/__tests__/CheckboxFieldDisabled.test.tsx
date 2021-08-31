import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CheckboxFieldDisabled } from "../CheckboxFieldDisabled";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const checkbox1TestId = "checkbox-1";
const checkbox2TestId = "checkbox-2";
const checkbox3TestId = "checkbox-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("CheckboxFieldDisabled", async () => {
  const { container } = render(<CheckboxFieldDisabled />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();

  // the second checkbox should be disabled
  expect(screen.getByTestId(checkbox1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(checkbox2TestId)).toBeDisabled();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeDisabled();

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ checkbox2: true });

  // check the first checkbox to enable the second one
  fireEvent.click(screen.getByTestId(checkbox1TestId));

  // the second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();

  // no checkbox should be disabled
  expect(screen.getByTestId(checkbox1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(checkbox2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeDisabled();

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ checkbox1: true, checkbox2: true });

  // uncheck the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // one error should be shown
  testInvalidMessage(container, 1);

  // uncheck the first checkbox
  fireEvent.click(screen.getByTestId(checkbox1TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();

  // the second checkbox should be disabled
  expect(screen.getByTestId(checkbox1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(checkbox2TestId)).toBeDisabled();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeDisabled();

  // check the third checkbox
  fireEvent.click(screen.getByTestId(checkbox3TestId));

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    checkbox1: false,
    checkbox2: true,
    checkbox3: true
  });

  // check the first checkbox
  fireEvent.click(screen.getByTestId(checkbox1TestId));

  // uncheck the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();

  // the second checkbox should be disabled
  expect(screen.getByTestId(checkbox1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(checkbox2TestId)).toBeDisabled();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeDisabled();
});
