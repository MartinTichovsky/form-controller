import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ReactHooksCollector } from "../../__tests__/utils/react-hooks-collector";
import { GeneralLabel } from "../GeneralLabel";

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
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("Basic workflow", () => {
  const { container } = render(<GeneralLabel />);

  // three labels exist
  const labels = container.querySelectorAll("label");
  expect(labels.length).toBe(3);

  // click on the first
  userEvent.click(screen.getByText("Salutation"));
  expect(screen.getByTestId(input1TestId)).toHaveFocus();

  // click on the second
  userEvent.click(screen.getByText("Given name"));
  expect(screen.getByTestId(input2TestId)).toHaveFocus();

  // click on the third
  userEvent.click(screen.getByText("Surname"));
  expect(screen.getByTestId(input3TestId)).toHaveFocus();

  // submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({});

  fireEvent.click(screen.getByTestId(resetTestId));
});
