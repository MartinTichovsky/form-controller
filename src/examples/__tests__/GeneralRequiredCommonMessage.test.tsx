import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { requiredStarClassName } from "../../constants";
import { GeneralRequiredCommonMessage } from "../GeneralRequiredCommonMessage";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const inputFieldRow1TestId = "input-field-row-1";
const inputFieldRow2TestId = "input-field-row-2";
const invalidFieldClassName = "invalid-field";
const invalidGlobalClassName = "invalid-global";
const invalidValidationClassName = "invalid-validation";
const radioFieldRow1TestId = "radio-field-row-1";
const radio2TestId = "radio-2";
const resetTestId = "reset";
const selectFieldRowTestId = "select-field-row";
const selectTestId = "select";
const submitTestId = "submit";
const textareaFieldrowTestId = "textarea-field-row";
const textareaTestId = "textarea";
const validFieldClassName = "valid-field";
const validGlobalClassName = "valid-global";
const validValidationClassName = "valid-validation";

const checkStarCount = (container: HTMLElement) => {
  expect(container.querySelectorAll(`.${requiredStarClassName}`).length).toBe(
    5
  );
};

test("GeneralRequiredCommonMessage", async () => {
  const { container } = render(<GeneralRequiredCommonMessage />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  checkStarCount(container);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input should have global message
  expect(
    screen
      .getByTestId(inputFieldRow1TestId)
      .querySelector(`.${invalidGlobalClassName}`)
  ).toBeTruthy();

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // no errors should be shown
  testInvalidMessage(container, 0);

  // input should have global message
  expect(
    screen
      .getByTestId(inputFieldRow1TestId)
      .querySelector(`.${validGlobalClassName}`)
  ).toBeTruthy();

  // input valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input should have global message
  expect(
    screen
      .getByTestId(inputFieldRow2TestId)
      .querySelector(`.${invalidGlobalClassName}`)
  ).toBeTruthy();

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // select a radio option
  fireEvent.click(screen.getByTestId(radio2TestId));

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input should have validation message
  expect(
    screen
      .getByTestId(radioFieldRow1TestId)
      .querySelector(`.${validValidationClassName}`)
  ).toBeTruthy();

  // select an option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "Option 1" }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input should have field message
  expect(
    screen
      .getByTestId(selectFieldRowTestId)
      .querySelector(`.${validGlobalClassName}`)
  ).toBeTruthy();

  // select an option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "" }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input should have global message
  expect(
    screen
      .getByTestId(selectFieldRowTestId)
      .querySelector(`.${invalidGlobalClassName}`)
  ).toBeTruthy();

  // select an option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "option-3" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // select a option
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: " " }
  });

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input should have global message
  expect(
    screen
      .getByTestId(textareaFieldrowTestId)
      .querySelector(`.${invalidFieldClassName}`)
  ).toBeTruthy();

  // select a option
  fireEvent.change(screen.getByTestId(textareaTestId), {
    target: { value: "Description" }
  });

  // submit should not be disabled
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // no errors should be shown
  testInvalidMessage(container, 0);

  // input should have global message
  expect(
    screen
      .getByTestId(textareaFieldrowTestId)
      .querySelector(`.${validFieldClassName}`)
  ).toBeTruthy();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    description: "Description",
    givenName: "James",
    surname: "Bond",
    radio: "Option 2",
    select: "option-3"
  });

  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit should be disabled
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  checkStarCount(container);
});
