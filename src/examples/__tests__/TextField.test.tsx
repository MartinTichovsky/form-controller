import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FormControllerComponent } from "../../components/FormController/FormControllerComponent";
import { InputComponent } from "../../components/Input/InputComponent";
import { SubmitComponent } from "../../components/Submit/SubmitComponent";
import { TextField } from "../TextField";
import { testErrorMessage } from "../utils/selectors";

console.log = jest.fn();

const formControllerTestId = "form-controller";
const input1TestId = "input-1";
const input2TestId = "input-2";
const reRenderTestId = "re-render";
const resetTestId = "reset";
const submitTestId = "submit";

afterAll(() => {
  jest.restoreAllMocks();
});

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
