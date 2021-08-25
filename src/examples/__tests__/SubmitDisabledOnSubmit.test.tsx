import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { SubmitDisabledOnSubmit } from "../SubmitDisabledOnSubmit";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitBottomTestId = "submit-bottom";
const submitTopTestId = "submit-top";

test("SubmitDisabledOnSubmit", () => {
  const { container } = render(<SubmitDisabledOnSubmit />);

  // Error messages should not exist
  testErrorMessage(container, 0);

  // buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitBottomTestId));

  // buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  testErrorMessage(container, 2);

  // reset form
  fireEvent.click(screen.getByTestId(resetTestId));

  // Error messages should not exist
  testErrorMessage(container, 0);

  // buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  testErrorMessage(container, 0);

  // buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  testErrorMessage(container, 0);

  // buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitBottomTestId));

  // buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  testErrorMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  testErrorMessage(container, 1);

  // buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  testErrorMessage(container, 0);

  // buttons must be not disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTopTestId));
  testErrorMessage(container, 0);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });

  // submit valid form
  fireEvent.click(screen.getByTestId(submitBottomTestId));
  testErrorMessage(container, 0);
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });
});
