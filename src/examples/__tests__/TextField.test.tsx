import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Field } from "../../components/Field/Field";
import { FormControllerComponent } from "../../components/FormController/FormControllerComponent";
import { SubmitComponent } from "../../components/Submit/SubmitComponent";
import { TextField } from "../TextField";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const formControllerTestId = "form-controller";
const input1TestId = "input-1";
const input2TestId = "input-2";
const reRenderTestId = "re-render";
const resetTestId = "reset";
const submitTestId = "submit";

beforeEach(() => {
  hooksCollector.reset();
});

test("TextField", async () => {
  const { container } = render(<TextField />);

  expect(screen.getByTestId(input1TestId)).toHaveAttribute(
    "placeholder",
    "Input a given name"
  );
  expect(screen.getByTestId(input2TestId)).toHaveAttribute(
    "placeholder",
    "Input a surname"
  );

  // render count check
  expect(hooksCollector.getComponentRenderCount(Field.name, input1TestId)).toBe(
    1
  );
  expect(hooksCollector.getComponentRenderCount(Field.name, input2TestId)).toBe(
    1
  );
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // error messages should be visible after click
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  expect(hooksCollector.getComponentRenderCount(Field.name, input1TestId)).toBe(
    2
  );
  expect(hooksCollector.getComponentRenderCount(Field.name, input2TestId)).toBe(
    2
  );
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // repeat submit should no more render the inputs
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(hooksCollector.getComponentRenderCount(Field.name, input1TestId)).toBe(
    2
  );
  expect(hooksCollector.getComponentRenderCount(Field.name, input2TestId)).toBe(
    2
  );
  expect(
    hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
  ).toBe(1);

  // input a text to the first input, after change or submit should be visible only one error message
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a text to the second input, after change should be visible no errors
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });
});

describe("Re-render", () => {
  test("Without Values", () => {
    render(<TextField />);

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2); // beacause the form controller creates a controller `useEffect` and set it with `setController`
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    fireEvent.click(screen.getByTestId(reRenderTestId));

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);
  });

  test("With Errors", async () => {
    const { container } = render(<TextField />);

    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    fireEvent.click(screen.getByTestId(reRenderTestId));

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(2); // because the second render is the submit event (validation)
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    // two errors should be shown
    testInvalidMessage(container, 2);

    fireEvent.click(screen.getByTestId(reRenderTestId));
  });

  test("With Values", () => {
    render(<TextField />);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    fireEvent.click(screen.getByTestId(reRenderTestId));

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(1);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(1);

    expect(screen.getByTestId(input1TestId)).toHaveValue("James");
    expect(screen.getByTestId(input2TestId)).toHaveValue("Bond");
  });
});

describe("Reset", () => {
  test("Without Values", () => {
    render(<TextField />);

    fireEvent.click(screen.getByTestId(resetTestId));

    expect(screen.getByTestId(input1TestId)).toHaveAttribute(
      "placeholder",
      "Input a given name"
    );
    expect(screen.getByTestId(input2TestId)).toHaveAttribute(
      "placeholder",
      "Input a surname"
    );

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    fireEvent.click(screen.getByTestId(resetTestId));

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(4);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(3);
  });

  test("With Errors", async () => {
    const { container } = render(<TextField />);

    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    fireEvent.click(screen.getByTestId(resetTestId));

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    // no errors must be shown
    testInvalidMessage(container, 0);
  });

  test("With values", () => {
    render(<TextField />);

    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    const reset = screen.getByTestId(resetTestId);
    fireEvent.click(reset);

    // render count check
    expect(
      hooksCollector.getComponentRenderCount(
        FormControllerComponent.name,
        formControllerTestId
      )
    ).toBe(3);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input1TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(Field.name, input2TestId)
    ).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(SubmitComponent.name, submitTestId)
    ).toBe(2);

    expect(screen.getByTestId(input1TestId)).toHaveValue("");
    expect(screen.getByTestId(input2TestId)).toHaveValue("");
  });
});
