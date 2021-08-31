import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  GeneralMessageForUseCase2,
  givenNameValidText,
  surnameValidText
} from "../GeneralMessageForUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("GeneralMessageForUseCase2", async () => {
  const { container } = render(<GeneralMessageForUseCase2 />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // text should be not in the document
  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });
  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // text should be not in the document
  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // click the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // input an invalid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();
});
