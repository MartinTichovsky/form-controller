import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RadioFieldDefaultValuesUseCase1 } from "../RadioFieldDefaultValuesUseCase1";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const radio11TestId = "radio-1-1";
const radio12TestId = "radio-1-2";
const radio13TestId = "radio-1-3";
const radio21TestId = "radio-2-1";
const radio22TestId = "radio-2-2";
const radio23TestId = "radio-2-3";
const radio31TestId = "radio-3-1";
const radio32TestId = "radio-3-2";
const radio33TestId = "radio-3-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("RadioFieldDefaultValuesUseCase1", async () => {
  const { container } = render(<RadioFieldDefaultValuesUseCase1 />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the option 1 and 2 of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio23TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check pre-selected options
  expect(screen.getByTestId(radio11TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the first option of radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio23TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-1",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-3"
  });

  // click on the third option of radio volume 1
  fireEvent.click(screen.getByTestId(radio13TestId));

  // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio23TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio21TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-3"
  });

  // click on the option 3 of radio volume 1
  fireEvent.click(screen.getByTestId(radio31TestId));

  // the second option of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio23TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-1"
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // click on the second option of radio volume 2
  fireEvent.click(screen.getByTestId(radio22TestId));

  // the first and second option of radio volume 1 and the first option of radio volume 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio23TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio22TestId)).toBeChecked();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the second option of radio volume 3
  fireEvent.click(screen.getByTestId(radio32TestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // the first option of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio22TestId)).toBeChecked();
  expect(screen.getByTestId(radio32TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(5);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // click on the second option of radio volume 1
  fireEvent.click(screen.getByTestId(radio12TestId));

  // the first option of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio12TestId)).toBeChecked();
  expect(screen.getByTestId(radio22TestId)).toBeChecked();
  expect(screen.getByTestId(radio32TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(6);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-2",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // click on the first option of radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // the option 1 and 2 of radio volume 1 and the second option of radio volume 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio11TestId)).toBeChecked();
  expect(screen.getByTestId(radio21TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // click on the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio31TestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(7);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-1",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-1"
  });

  // click on the third option of radio volume 1
  fireEvent.click(screen.getByTestId(radio13TestId));

  // click on the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio23TestId));

  // the second option of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio23TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(8);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-3",
    radioVolume3: "Option 3-3"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the option 1 and 2 of radio volume 1 and 3 should be disabled
  expect(screen.getByTestId(radio11TestId)).toBeDisabled();
  expect(screen.getByTestId(radio12TestId)).toBeDisabled();
  expect(screen.getByTestId(radio13TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio21TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio22TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio31TestId)).toBeDisabled();
  expect(screen.getByTestId(radio32TestId)).toBeDisabled();
  expect(screen.getByTestId(radio33TestId)).not.toBeDisabled();

  // check selected options
  expect(screen.getByTestId(radio11TestId)).toBeChecked();
  expect(screen.getByTestId(radio21TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);
});
