import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TextFieldHiddenUseCase2 } from "../TextFieldHiddenUseCase2";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldHiddenUseCase2", () => {
  const { container } = render(<TextFieldHiddenUseCase2 />);

  // the first and the third input must not be in the document
  expect(() => screen.getByTestId(input1TestId)).toThrowError();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(input3TestId)).toThrowError();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // the first and the third input must not be in the document
  expect(() => screen.getByTestId(input1TestId)).toThrowError();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(input3TestId)).toThrowError();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });

  // the first input must not be in the document and the submit button must be disabled
  expect(() => screen.getByTestId(input1TestId)).toThrowError();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(screen.getByTestId(input3TestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: " " }
  });

  // the first input must not be in the document and the submit button must be disabled
  expect(() => screen.getByTestId(input1TestId)).toThrowError();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(screen.getByTestId(input3TestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // all fields must be in the document
  expect(screen.getByTestId(input1TestId)).toBeTruthy();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(screen.getByTestId(input3TestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // all fields must be in the document
  expect(screen.getByTestId(input1TestId)).toBeTruthy();
  expect(screen.getByTestId(input2TestId)).toBeTruthy();
  expect(screen.getByTestId(input3TestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: " ",
    surname: "Bond"
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // input a text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "Mr." }
  });

  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));
});
