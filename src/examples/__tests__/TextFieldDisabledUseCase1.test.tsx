import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDisabledUseCase1 } from "../TextFieldDisabledUseCase1";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldDisabledUseCase1", async () => {
  const { container } = render(<TextFieldDisabledUseCase1 />);

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: " " }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });

  // only the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  // only the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // input an empty value should disable all other inputs
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "" }
  });

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(input1TestId)).toBeDisabled();
  expect(screen.getByTestId(input2TestId)).not.toBeDisabled();
  expect(screen.getByTestId(input3TestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testErrorMessage(container, 1);

  // fill all inputs
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(input3TestId), {
    target: { value: "Bond" }
  });
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "Mr." }
  });

  // the submit button must not be disabled
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));
});
