import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TextFieldInputComponent } from "../TextFieldInputComponent";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const classInputId = "class-input";
const functionalInputId = "functional-input";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldInputComponent", () => {
  const { container } = render(<TextFieldInputComponent />);

  // errors shouldn't be shown
  expect(container.querySelector(`#${classInputId}`)).toBeTruthy();
  expect(container.querySelector(`#${functionalInputId}`)).toBeTruthy();

  // error messages should not exist
  testErrorMessage(container, 0);

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitTestId));

  testErrorMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  testErrorMessage(container, 1);

  // input an empty text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));
});
