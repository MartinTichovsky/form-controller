import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Input } from "../components/Input/Input";
import { InputComponent } from "../components/Input/InputComponent";
import { Controller } from "../controller";
import { getGeneratedValues } from "./utils/value-generator";

type Form = {
  input: string;
};

const testid = "test-id";
let controller: Controller<Form>;

console.error = jest.fn();

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Input Element", () => {
  test("Default functionality", () => {
    render(<Input data-testid={testid} controller={controller} name="input" />);

    expect(screen.getByTestId(testid)).toBeTruthy();
  });

  test("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();

    values.forEach((value: Controller<Form>) => {
      expect(() => {
        render(<Input controller={value} name="input" />);
      }).toThrowError();
    });
  });
});

describe("InputComponent Element", () => {
  test("Default functionality", () => {
    hooksCollector.reset();

    const { unmount } = render(
      <InputComponent controller={controller} name="input" />
    );
  });
});
