import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { TextFieldDisabled } from "../TextFieldDisabled";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

afterAll(() => {
  jest.restoreAllMocks();
});

test("Basic workflow", () => {
  const { container } = render(<TextFieldDisabled />);

  // first and third input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // Error messages should not exist
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // first and third input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });

  // first input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: " " }
  });

  // first input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // only submit must be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // only submit must be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 1);

  // input an empty value should disable all other inputs
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "" }
  });

  // first and third input must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  testErrorMessage(container, 1);

  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "Mr." }
  });

  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  testErrorMessage(container, 0);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));
});
