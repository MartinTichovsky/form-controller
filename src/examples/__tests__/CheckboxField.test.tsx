import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CheckboxField } from "../CheckboxField";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const checkbox1TestId = "checkbox-1";
const checkbox2TestId = "checkbox-2";
const checkbox3TestId = "checkbox-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("CheckboxField", async () => {
  const { container } = render(<CheckboxField />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // check the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ checkbox2: true });

  // check the third checkbox
  fireEvent.click(screen.getByTestId(checkbox3TestId));

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ checkbox2: true, checkbox3: true });

  // uncheck the second checkbox
  fireEvent.click(screen.getByTestId(checkbox3TestId));

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({ checkbox2: true, checkbox3: false });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // uncheck the second checkbox
  fireEvent.click(screen.getByTestId(checkbox2TestId));

  // one error should be shown
  testInvalidMessage(container, 1);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // no checkbox should be checked
  expect(screen.getByTestId(checkbox1TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox2TestId)).not.toBeChecked();
  expect(screen.getByTestId(checkbox3TestId)).not.toBeChecked();
});
