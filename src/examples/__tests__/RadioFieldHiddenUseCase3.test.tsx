import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RadioFieldHiddenUseCase3 } from "../RadioFieldHiddenUseCase3";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const radio11TestId = "radio-1-1";
const radio12TestId = "radio-1-2";
const radio13TestId = "radio-1-3";
const radio21TestId = "radio-2-1";
const radio22TestId = "radio-2-2";
const radio31TestId = "radio-3-1";
const radio32TestId = "radio-3-2";
const radio33TestId = "radio-3-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("RadioFieldHiddenUseCase3", async () => {
  const { container } = render(<RadioFieldHiddenUseCase3 />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // the first and the second option of radio volume 1 and 3 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // three errors should be shown
  testErrorMessage(container, 3);

  // select all needed options
  fireEvent.click(screen.getByTestId(radio13TestId));
  fireEvent.click(screen.getByTestId(radio21TestId));
  fireEvent.click(screen.getByTestId(radio33TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-3"
  });

  // the first option of radio volume 2 should not be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // select the second option of radio volume 2
  fireEvent.click(screen.getByTestId(radio22TestId));

  // the second option of radio volume 2 should not be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // the third option of radio volume 1 and 3 should be still selected
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-3"
  });

  // select the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio32TestId));

  // the second option of radio volume 1 and 3 should not be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(screen.getByTestId(radio12TestId)).toBeTruthy();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // select the second option of radio volume 1
  fireEvent.click(screen.getByTestId(radio12TestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-2",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // select the first option of radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // the first and the second option of radio volume 1 must be hidden, the second option of radio volume 3 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // no options should be checked except for the first option of radio volume 2
  expect(screen.getByTestId(radio13TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio31TestId)).not.toBeChecked();
  expect(screen.getByTestId(radio33TestId)).not.toBeChecked();

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // two errros should be shown
  testErrorMessage(container, 2);

  expect(console.log).toBeCalledTimes(4);

  // select the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio31TestId));

  // one errro should be shown
  testErrorMessage(container, 1);

  // select the first option of radio volume 1
  fireEvent.click(screen.getByTestId(radio11TestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(5);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-1",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-1"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the first and the second option of radio volume 1 and 3 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();
});
