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

afterAll(() => {
  jest.restoreAllMocks();
});

test("Basic workflow", () => {
  const { container } = render(<TextFieldDefaultValues />);

  // must have default values
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");

  // Error messages should not exist
  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "" }
  });

  testErrorMessage(container, 1);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "" }
  });

  testErrorMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // must have default values
  expect(screen.getByTestId(input1TestId)).toHaveValue("James");
  expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");
});
