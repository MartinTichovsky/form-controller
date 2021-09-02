import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextareaField } from "../TextareaField";

console.log = jest.fn();
console.warn = jest.fn();

const errorTestId = "error";
const invalidTestId = "invalid-text";
const resetTestId = "reset";
const submitTestId = "submit";
const textareaTestId = "textarea";
const validTestId = "valid-text";

test("TextareaField", async () => {
  render(<TextareaField />);

  expect(screen.getByTestId(textareaTestId)).toHaveAttribute(
    "placeholder",
    "Input a text"
  );

  // default valid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(() => screen.getByTestId(invalidTestId)).toThrowError();
  expect(screen.getByTestId(validTestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit event
  expect(console.warn).not.toBeCalled();

  // error text should be shown
  expect(screen.getByTestId(errorTestId)).toBeTruthy();
  expect(() => screen.getByTestId(invalidTestId)).toThrowError();
  expect(() => screen.getByTestId(validTestId)).toThrowError();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // default valid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(() => screen.getByTestId(invalidTestId)).toThrowError();
  expect(screen.getByTestId(validTestId)).toBeTruthy();

  // input a valid text
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "James Bon" }
  });

  // default valid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(() => screen.getByTestId(invalidTestId)).toThrowError();
  expect(screen.getByTestId(validTestId)).toBeTruthy();

  // input a valid text
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "James Bond" }
  });

  // default valid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(() => screen.getByTestId(invalidTestId)).toThrowError();
  expect(screen.getByTestId(validTestId)).toBeTruthy();

  // input too much text
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "James BondJ" }
  });

  // invalid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(screen.getByTestId(invalidTestId)).toBeTruthy();
  expect(() => screen.getByTestId(validTestId)).toThrowError();

  // input too much text
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "James Bond Junior" }
  });

  // invalid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(screen.getByTestId(invalidTestId)).toBeTruthy();
  expect(() => screen.getByTestId(validTestId)).toThrowError();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit event
  expect(console.warn).not.toBeCalled();

  // invalid text should be shown
  expect(() => screen.getByTestId(errorTestId)).toThrowError();
  expect(screen.getByTestId(invalidTestId)).toBeTruthy();
  expect(() => screen.getByTestId(validTestId)).toThrowError();

  // input a valid text
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "James Bond" }
  });

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    description: "James Bond"
  });
});
