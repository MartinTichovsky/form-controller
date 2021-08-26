import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TextFieldErrorComponent } from "../TextFieldErrorComponent";

console.log = jest.fn();

const classComponentTestId = "class-component";
const functionalComponentTestId = "functional-component";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldErrorComponent", () => {
  render(<TextFieldErrorComponent />);

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // errors must be shown
  expect(screen.getByTestId(classComponentTestId)).toBeTruthy();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

  // input an empty text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // functional error must be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // input an empty text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // two errors must be shown
  expect(screen.getByTestId(classComponentTestId)).toBeTruthy();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({
    givenName: "James",
    surname: "Bond"
  });
});
