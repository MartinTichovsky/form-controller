import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { sleep } from "../../__tests__/utils/utils";
import { SubmitComponent } from "../SubmitComponent";
import { testErrorMessage } from "../utils/selectors";

jest.setTimeout(10000);

console.error = jest.fn();
console.log = jest.fn();

const buttonClassPendingText = "class component pending...";
const buttonFunctionalPendingText = "functional component pending...";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitClassComponentTestId = "class-submit";
const submitFunctionalComponentTestId = "functional-submit";

test("SubmitComponent", async () => {
  const { container } = render(<SubmitComponent />);

  // error messages should not exist
  testErrorMessage(container, 0);

  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  // click on the class submit component
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  // errors must be shown
  testErrorMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // error messages should not exist
  testErrorMessage(container, 0);

  // click on the functional submit component
  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));

  // errors must be shown
  testErrorMessage(container, 2);

  // input valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  testErrorMessage(container, 1);

  // input valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  testErrorMessage(container, 0);

  // click on the class submit component
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // click on the functional submit component
  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));

  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    buttonClassPendingText
  );
  expect(screen.getByTestId(submitFunctionalComponentTestId)).toHaveTextContent(
    buttonFunctionalPendingText
  );

  expect(console.log).toHaveBeenCalledTimes(2);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  expect(console.error).not.toBeCalled();

  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);
});
