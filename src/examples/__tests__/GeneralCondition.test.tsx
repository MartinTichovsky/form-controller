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

  // errors should not be shown
  testErrorMessage(container, 0);

  // the condition text must not be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();

  // click on the submit button
  fireEvent.click(screen.getByTestId(submitTestId));

  // the custom condition text must be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // two errors should be shown
  testErrorMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // the custom condition text must be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // one error should be shown
  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // both condition text must be in the document
  expect(screen.queryByText(formIsValidText)).toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  //check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the condition text must not be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();
});
