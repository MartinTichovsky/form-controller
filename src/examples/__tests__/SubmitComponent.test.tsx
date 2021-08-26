import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { sleep } from "../../__tests__/utils/utils";
import { SubmitComponent } from "../SubmitComponent";
import { testErrorMessage } from "../utils/selectors";

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

  // errors should not be shown
  testErrorMessage(container, 0);

  // the buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  // click on the class submit component
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  // two errors should be shown
  testErrorMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // click on the functional submit component
  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));

  // two errors must be shown
  testErrorMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // input valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testErrorMessage(container, 0);

  // click on the class submit component
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  // the class component button must have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  // check the onSubmit action
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // click on the functional submit component
  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));

  // the functional component button must have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    buttonClassPendingText
  );
  expect(screen.getByTestId(submitFunctionalComponentTestId)).toHaveTextContent(
    buttonFunctionalPendingText
  );

  // check the onSubmit action
  expect(console.log).toHaveBeenCalledTimes(2);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  // after timout the submit buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);

  // click on the buttons to cause pending again
  fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));
  fireEvent.click(screen.getByTestId(submitClassComponentTestId));

  // reset the form to unmount the elements and create new ones
  fireEvent.click(screen.getByTestId(resetTestId));

  // wait for delay
  await act(async () => {
    await sleep(2000);
  });

  // no console errors should be caused
  expect(console.error).not.toBeCalled();

  // the submit buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    buttonClassPendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(buttonFunctionalPendingText);
}, 10000);
