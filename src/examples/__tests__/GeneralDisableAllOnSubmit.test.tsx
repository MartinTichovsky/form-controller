import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { GeneralDisableAllOnSubmit } from "../GeneralDisableAllOnSubmit";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const radio1TestId = "radio-1";
const radio2TestId = "radio-2";
const resetTestId = "reset";
const submitTestId = "submit";

afterAll(() => {
  jest.restoreAllMocks();
});

test("GeneralErrorFor", async () => {
  render(<GeneralDisableAllOnSubmit />);

  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).not.toBeDisabled();

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({});

  // all inputs must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).toBeDisabled();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).not.toBeDisabled();
});
