import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  invalidFieldClassName,
  requiredStarClassName,
  validFieldClassName
} from "../../constants";
import { GeneralRequired } from "../GeneralRequired";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const resetTestId = "reset";
const submitTestId = "submit";

const testSuite = async (container: HTMLElement) => {
  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toBeCalled();

  // input an empty value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check class names
  expect(screen.getByTestId(input1TestId)).toHaveClass(invalidFieldClassName);
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(validFieldClassName);
  expect(screen.getByTestId(input2TestId)).toHaveClass(invalidFieldClassName);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(validFieldClassName);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toBeCalled();

  // input a value
  fireEvent.change(screen.getByTestId(input1TestId), {
    target: { value: "James" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check class names
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(
    invalidFieldClassName
  );
  expect(screen.getByTestId(input1TestId)).toHaveClass(validFieldClassName);
  expect(screen.getByTestId(input2TestId)).toHaveClass(invalidFieldClassName);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(validFieldClassName);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toBeCalled();

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bon" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // check class names
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(
    invalidFieldClassName
  );
  expect(screen.getByTestId(input1TestId)).toHaveClass(validFieldClassName);
  expect(screen.getByTestId(input2TestId)).toHaveClass(invalidFieldClassName);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(validFieldClassName);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toBeCalled();

  // input a value
  fireEvent.change(screen.getByTestId(input2TestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check class names
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(
    invalidFieldClassName
  );
  expect(screen.getByTestId(input1TestId)).toHaveClass(validFieldClassName);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(
    invalidFieldClassName
  );
  expect(screen.getByTestId(input2TestId)).toHaveClass(validFieldClassName);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);

  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("GeneralRequired", () => {
  test("Validate on change", async () => {
    const { container } = render(<GeneralRequired />);

    // stars must be in the document
    expect(container.querySelectorAll(`.${requiredStarClassName}`).length).toBe(
      2
    );

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check class names
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      validFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      validFieldClassName
    );

    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // check the onSubmit action
    expect(console.log).not.toBeCalled();

    // check class names
    expect(screen.getByTestId(input1TestId)).toHaveClass(invalidFieldClassName);
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      validFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).toHaveClass(invalidFieldClassName);
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      validFieldClassName
    );

    // reset the form
    fireEvent.click(screen.getByTestId(resetTestId));

    // errors should not be shown
    testInvalidMessage(container, 0);

    // stars must be in the document
    expect(container.querySelectorAll(`.${requiredStarClassName}`).length).toBe(
      2
    );

    // input an empty value
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: " " }
    });

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check class names
    expect(screen.getByTestId(input1TestId)).toHaveClass(invalidFieldClassName);
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      validFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      validFieldClassName
    );

    await testSuite(container);
  });

  test("Validate on submit", async () => {
    const { container } = render(<GeneralRequired validateOnChange={false} />);

    // stars must be in the document
    expect(container.querySelectorAll(`.${requiredStarClassName}`).length).toBe(
      2
    );

    // input a value
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: " " }
    });

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check class names
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      validFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      validFieldClassName
    );

    // input a value
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: " " }
    });

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check class names
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input1TestId)).not.toHaveClass(
      validFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      invalidFieldClassName
    );
    expect(screen.getByTestId(input2TestId)).not.toHaveClass(
      validFieldClassName
    );

    await testSuite(container);
  });
});
