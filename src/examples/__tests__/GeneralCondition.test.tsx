import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
  formIsValidText,
  GeneralCondition,
  submitConditionText
} from "../GeneralCondition";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("GeneralCondition", async () => {
  const { container } = render(<GeneralCondition />);

  // error messages should not exist
  testErrorMessage(container, 0);

  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();

  // click the submit button
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  testErrorMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  expect(screen.queryByText(formIsValidText)).toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });

  fireEvent.click(screen.getByTestId(resetTestId));

  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();
});
