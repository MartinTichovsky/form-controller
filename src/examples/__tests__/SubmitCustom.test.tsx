import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { sleep } from "../../__tests__/utils/utils";
import { SubmitCustom } from "../SubmitCustom";
import { testErrorMessage } from "../utils/selectors";

jest.setTimeout(10000);

console.error = jest.fn();
console.log = jest.fn();

const buttonPendingText = "pending...";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("SubmitCustom", async () => {
  const { container } = render(<SubmitCustom />);

  // error messages should not exist
  testErrorMessage(container, 0);

  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );

  // click on the submit
  fireEvent.click(screen.getByTestId(submitTestId));

  // errors must be shown
  testErrorMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // error messages should not exist
  testErrorMessage(container, 0);

  // input valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // click on the class submit component
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(screen.getByTestId(submitTestId)).toHaveTextContent(buttonPendingText);

  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );

  fireEvent.click(screen.getByTestId(submitTestId));

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  expect(console.error).not.toBeCalled();

  expect(screen.getByTestId(submitTestId)).not.toHaveTextContent(
    buttonPendingText
  );
});
