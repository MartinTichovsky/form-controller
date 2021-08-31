import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CheckboxFieldDefaultValues } from "../CheckboxFieldDefaultValues";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const checkbox1TestId = "checkbox-1";
const checkbox2TestId = "checkbox-2";
const checkbox3TestId = "checkbox-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("CheckboxFieldDefaultValues", async () => {
  const { container } = render(<CheckboxFieldDefaultValues />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ checkbox2: true });

  // uncheck the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // check the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // click on the third checkbox
  fireEvent.click(screen.getByTestId(checkbox3TestId));

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ checkbox2: true, checkbox3: true });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // second checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();
});
