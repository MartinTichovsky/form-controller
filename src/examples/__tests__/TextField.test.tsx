import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FormControllerComponent } from "../../components/FormController/FormControllerComponent";
import { InputComponent } from "../../components/Input/InputComponent";
import { SubmitComponent } from "../../components/Submit/SubmitComponent";
import { ReactHooksCollector } from "../../__tests__/utils/react-hooks-collector";
import { TextField } from "../TextField";
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

const formControllerTestId = "form-controller";
const input1TestId = "input-1";
const input2TestId = "input-2";
const reRenderTestId = "re-render";
const resetTestId = "reset";
const submitTestId = "submit";

test("Basic workflow", () => {
  const { container } = render(<TextField />);

  // Render count check
  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
  ).toBe(1);
  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
  ).toBe(1);
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // Error messages should not exist
  testErrorMessage(container, 0);

  // Error messages should be visible after click
  fireEvent.click(screen.getByTestId(submitTestId));

  testErrorMessage(container, 2);

  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
  ).toBe(2);
  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
  ).toBe(2);
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // Repeat submit should no more render the inputs
  fireEvent.click(screen.getByTestId(submitTestId));

  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
  ).toBe(3);
  expect(
    hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
  ).toBe(3);
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // Input text to the first input, after change or submit should be visible only one error message
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });
  testErrorMessage(container, 1);

  fireEvent.click(screen.getByTestId(submitTestId));
  testErrorMessage(container, 1);

  // Input text to the second input, after change should be visible no errors
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });
  testErrorMessage(container, 0);

  // Submit valid form
  fireEvent.click(screen.getByTestId(submitTestId));
  testErrorMessage(container, 0);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith({ givenName: "James", surname: "Bond" });
});

describe("Re-render", () => {
  test("Without values", () => {
    hooksCollector.reset();

    render(<TextField />);

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2); // beacause the form controller creates a controller `useEffect` and set it with `setController`
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    fireEvent.click(screen.getByTestId(reRenderTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);
  });

  test("With errors", () => {
    hooksCollector.reset();

    const { container } = render(<TextField />);

    fireEvent.click(screen.getByTestId(submitTestId));
    fireEvent.click(screen.getByTestId(reRenderTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(2); // because the second render is the submit event (validation)
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    // error must be visible
    testErrorMessage(container, 2);

    fireEvent.click(screen.getByTestId(reRenderTestId));
  });

  test("With values", () => {
    hooksCollector.reset();

    render(<TextField />);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    fireEvent.click(screen.getByTestId(reRenderTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    expect(screen.getByTestId(input1TestId)).toHaveValue("James");
    expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");
  });
});

describe("Reset", () => {
  test("Without values", () => {
    hooksCollector.reset();

    render(<TextField />);

    fireEvent.click(screen.getByTestId(resetTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    fireEvent.click(screen.getByTestId(resetTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(4);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(3);
  });

  test("With errors", () => {
    hooksCollector.reset();

    const { container } = render(<TextField />);

    fireEvent.click(screen.getByTestId(submitTestId));
    fireEvent.click(screen.getByTestId(resetTestId));

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    // error must be visible
    testErrorMessage(container, 0);
  });

  test("With values", () => {
    hooksCollector.reset();

    render(<TextField />);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    const reset = screen.getByTestId(resetTestId);
    fireEvent.click(reset);

    // Render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input1TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(InputComponent.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    expect(screen.getByTestId(input1TestId)).toHaveValue("");
    expect(screen.getByTestId(input2TestId)).toHaveValue("");
  });
});
