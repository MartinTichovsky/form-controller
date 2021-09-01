import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { Field } from "../Field/Field";

type Form = {
  input: string;
};

const testid = "test-id";
let controller: Controller<Form>;

console.error = jest.fn();

beforeEach(() => {
  hooksCollector.reset();
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Field", () => {
  test("Default functionality", () => {
    render(
      <Field
        controller={controller}
        fieldType="input"
        initialState={{
          isDisabled: false,
          isValid: true,
          isVisible: true,
          message: undefined
        }}
        name="input"
      />
    );
  });
});
