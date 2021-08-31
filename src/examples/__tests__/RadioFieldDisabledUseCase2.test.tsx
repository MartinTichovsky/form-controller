import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RadioFieldDisabledUseCase2 } from "../RadioFieldDisabledUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const radio11TestId = "radio-1-1";
const radio12TestId = "radio-1-2";
const radio21TestId = "radio-2-1";
const radio22TestId = "radio-2-2";
const radio31TestId = "radio-3-1";
const radio32TestId = "radio-3-2";
const resetTestId = "reset";
const submitTestId = "submit";

let expectedConsoleLogCallNumber = 0;

const testWorkflow = async (container: HTMLElement) => {
  // the radio volume 1 and 3 must be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the second option of the radio volume 2
  fireEvent.click(screen.getByTestId(radio22TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the second option of the radio volume 3 should not be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).not.toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the second option of the radio volume 3
  fireEvent.click(screen.getByTestId(radio32TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the second option of the radio volume 1 should not be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).not.toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the second option of the radio volume 1
  fireEvent.click(screen.getByTestId(radio12TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(expectedConsoleLogCallNumber++ + 1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-2",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // click on the first option of the radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // no inputs must be checked
  expect(screen.getByTestId(radio11TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio12TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio31TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio32TestId)).not.toBeChecked();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the first option of the radio volume 3 should not be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the first option of the radio volume 3
  fireEvent.click(screen.getByTestId(radio31TestId));

  // the first option of the radio volume 1 should not be disabled
  expect(screen.getByTestId(radio11TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();

  // click on the first option of the radio volume 1
  fireEvent.click(screen.getByTestId(radio11TestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(expectedConsoleLogCallNumber++ + 1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-1",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-1"
  });

  // click on the second option of the radio volume 2
  fireEvent.click(screen.getByTestId(radio22TestId));

  // errors should not be shown
  testInvalidMessage(container, 0);
};

test("RadioFieldDisabledUseCase2", async () => {
  const { container } = render(<RadioFieldDisabledUseCase2 />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // first test
  await testWorkflow(container);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // second test
  await testWorkflow(container);
});
