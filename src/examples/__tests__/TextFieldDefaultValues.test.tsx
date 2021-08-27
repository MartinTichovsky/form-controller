import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TextFieldDefaultValues } from "../TextFieldDefaultValues";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldDefaultValues", () => {
  const { container } = render(<TextFieldDefaultValues />);

  // the inputs must have default values
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "" }
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "" }
  });

  // two errors should be shown
  testErrorMessage(container, 2);

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the inputs must have default values
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");
});
