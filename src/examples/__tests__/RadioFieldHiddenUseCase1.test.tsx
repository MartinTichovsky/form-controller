import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RadioFieldHiddenUseCase1 } from "../RadioFieldHiddenUseCase1";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const radio11TestId = "radio-1-1";
const radio12TestId = "radio-1-2";
const radio21TestId = "radio-2-1";
const radio22TestId = "radio-2-2";
const radio31TestId = "radio-3-1";
const radio32TestId = "radio-3-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("RadioFieldHiddenUseCase1", async () => {
  const { container } = render(<RadioFieldHiddenUseCase1 />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // the radio volume 1 and 3 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // click on the first option of the radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // the radio volume 1 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // click on the second option of the radio volume 3
  fireEvent.click(screen.getByTestId(radio32TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // all inputs must not be hidden
  expect(screen.getByTestId(radio11TestId)).toBeTruthy();
  expect(screen.getByTestId(radio12TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testErrorMessage(container, 1);

  // click on the second option of the radio volume 1
  fireEvent.click(screen.getByTestId(radio12TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-2",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-2"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // the radio volume 1 and 3 must be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
});
