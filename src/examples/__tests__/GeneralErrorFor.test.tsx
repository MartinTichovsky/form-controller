import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
  GeneralErrorFor,
  givenNameErrorText,
  surnameErrorText
} from "../GeneralErrorFor";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("GeneralErrorFor", async () => {
  const { container } = render(<GeneralErrorFor />);

  // error messages should not exist
  testErrorMessage(container, 0);

  expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

  // click the submit button
  fireEvent.click(screen.getByTestId(submitTestId));

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
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });

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
