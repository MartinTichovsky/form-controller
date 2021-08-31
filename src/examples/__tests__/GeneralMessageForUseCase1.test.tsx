import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  GeneralMessageForUseCase1,
  givenNameErrorText,
  surnameErrorText
} from "../GeneralMessageForUseCase1";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("GeneralMessageForUseCase1", async () => {
  const { container } = render(<GeneralMessageForUseCase1 />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // text should be not in the document
  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });
  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // text should be not in the document
  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId(resetTestId));

  // click the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(screen.queryByText(givenNameErrorText)).toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  expect(screen.queryByText(givenNameErrorText)).toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();
});
