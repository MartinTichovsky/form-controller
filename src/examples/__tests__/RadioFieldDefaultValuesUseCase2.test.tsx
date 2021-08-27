import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { RadioFieldDefaultValuesUseCase2 } from "../RadioFieldDefaultValuesUseCase2";
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

test("RadioFieldDefaultValuesUseCase2", () => {
  const { container } = render(<RadioFieldDefaultValuesUseCase2 />);

  // errors should not be shown
  testErrorMessage(container, 0);

  // the option 1 and 2 of radio volume 1 and 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // check pre-selected options
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // two errors should be shown
  testErrorMessage(container, 2);

  // click on the first option of radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // one error should be shown
  testErrorMessage(container, 1);

  // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // click on the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio31TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // the second option of radio volume 1 and 3 should be hidden
  expect(screen.getByTestId(radio11TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-1",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-1"
  });

  // click on the second option of radio volume 2
  fireEvent.click(screen.getByTestId(radio22TestId));

  // one error should be shown
  testErrorMessage(container, 1);

  // the option 1 and 2 of radio volume 1 and option 1 of radio volume 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // check pre-selected options
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // click on the third option of radio volume 1
  fireEvent.click(screen.getByTestId(radio13TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-3"
  });

  // click on the second option of radio volume 3
  fireEvent.click(screen.getByTestId(radio32TestId));

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio22TestId)).toBeChecked();
  expect(screen.getByTestId(radio32TestId)).toBeChecked();

  // the first option of radio volume 1 and 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(screen.getByTestId(radio12TestId)).toBeTruthy();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(screen.getByTestId(radio32TestId)).toBeTruthy();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-2",
    radioVolume3: "Option 3-2"
  });

  // click on the second option of radio volume 1
  fireEvent.click(screen.getByTestId(radio12TestId));

  // click on the first option of radio volume 2
  fireEvent.click(screen.getByTestId(radio21TestId));

  // one error should be shown
  testErrorMessage(container, 1);

  // check selected options
  expect(screen.getByTestId(radio21TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit invalid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(3);

  // click on the third option of radio volume 1
  fireEvent.click(screen.getByTestId(radio13TestId));

  // errors should not be shown
  testErrorMessage(container, 0);

  // the first and the second option of radio volume 1 and the second option of radio volume 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(screen.getByTestId(radio31TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // check selected options
  expect(screen.getByTestId(radio13TestId)).toBeChecked();
  expect(screen.getByTestId(radio21TestId)).toBeChecked();
  expect(screen.getByTestId(radio33TestId)).toBeChecked();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    radioVolume1: "Option 1-3",
    radioVolume2: "Option 2-1",
    radioVolume3: "Option 3-3"
  });

  // click on the first option of radio volume 3
  fireEvent.click(screen.getByTestId(radio31TestId));

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the option 1 and 2 of radio volume 1 and 3 should be hidden
  expect(() => screen.getByTestId(radio11TestId)).toThrowError();
  expect(() => screen.getByTestId(radio12TestId)).toThrowError();
  expect(screen.getByTestId(radio13TestId)).toBeTruthy();
  expect(screen.getByTestId(radio21TestId)).toBeTruthy();
  expect(screen.getByTestId(radio22TestId)).toBeTruthy();
  expect(() => screen.getByTestId(radio31TestId)).toThrowError();
  expect(() => screen.getByTestId(radio32TestId)).toThrowError();
  expect(screen.getByTestId(radio33TestId)).toBeTruthy();

  // check pre-selected options
  expect(screen.getByTestId(radio33TestId)).toBeChecked();
});
