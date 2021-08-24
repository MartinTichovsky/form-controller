import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ReactHooksCollector } from "../../__tests__/utils/react-hooks-collector";
import { GeneralValidateOnChange } from "../GeneralValidateOnChange";
import { testErrorMessage } from "../utils/selectors";

let hooksCollector: ReactHooksCollector;

// mocking react to get statistics from calling hooks
jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const {
    mockReactHooks,
    ReactHooksCollector
  } = require("../../__tests__/utils/react-hooks-collector");
  hooksCollector = new ReactHooksCollector();

  return mockReactHooks(origin, hooksCollector);
});

// mocking the component to get statistics of render count
jest.mock("../../components/FormController/FormControllerComponent", () => {
  const origin = jest.requireActual(
    "../../components/FormController/FormControllerComponent"
  );
  const { mockComponent } = require("../../__tests__/utils/clone-function");

  return {
    ...origin,
    FormControllerComponent: mockComponent(
      origin,
      origin.FormControllerComponent.name,
      hooksCollector
    )
  };
});

jest.mock("../../components/Input/InputComponent", () => {
  const origin = jest.requireActual("../../components/Input/InputComponent");
  const { mockComponent } = require("../../__tests__/utils/clone-function");

  return {
    ...origin,
    InputComponent: mockComponent(
      origin,
      origin.InputComponent.name,
      hooksCollector
    )
  };
});

jest.mock("../../components/Submit/SubmitComponent", () => {
  const origin = jest.requireActual("../../components/Submit/SubmitComponent");
  const { mockComponent } = require("../../__tests__/utils/clone-function");

  return {
    ...origin,
    SubmitComponent: mockComponent(
      origin,
      origin.SubmitComponent.name,
      hooksCollector
    )
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

test("Basic workflow", () => {
  const { container } = render(<GeneralValidateOnChange />);

  // Error messages should not exist
  testErrorMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: " " }
  });

  testErrorMessage(container, 1);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

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

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });

  fireEvent.click(screen.getByTestId(resetTestId));
});
