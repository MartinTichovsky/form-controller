import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralConditionDynamic } from "../GeneralConditionDynamic";

console.log = jest.fn();

const dynamicContentTestId = "dynamic-content";
const dynamicContextTestId = "dynamic-context";
const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

const getTestedGivenNameText = (name: string) =>
  `Your given name is: ${name}`.trim();
const getTesteSurnameText = (name: string) => `Your surname is: ${name}`.trim();

test("GeneralConditionDynamic", async () => {
  render(<GeneralConditionDynamic />);

  // the default text should be visible
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "J" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("J")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "Ja" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("Ja")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ givenName: "James" });

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "B" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("B")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bo" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("Bo")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("Bond")
  );

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the default text should be visible
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );
});
