import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RadioField } from "../RadioField";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const radio1TestId = "radio-1";
const radio2TestId = "radio-2";
const radio3TestId = "radio-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("RadioField", async () => {
  const { container } = render(<RadioField />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // click on the first option
  fireEvent.click(screen.getByTestId(radio1TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ radio: "Option 1" });

  // click on the second option
  fireEvent.click(screen.getByTestId(radio2TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ radio: "Option 2" });

  // click on the third option
  fireEvent.click(screen.getByTestId(radio3TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({ radio: "Option 3" });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // no option must be selected
  expect(screen.getByTestId(radio1TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio2TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio3TestId)).not.toBeChecked();
});
