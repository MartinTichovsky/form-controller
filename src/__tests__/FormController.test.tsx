import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../controller";
import { FormController, FormControllerComponent } from "../FormController";
import { Hooks } from "./utils/hook-mock";
import { getGeneratedValues } from "./utils/value-generator";

type Form = {
  input: string;
};

const testid = "test-id";
let hooks: Hooks;

jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const { Hooks, mockReactHooks } = require("./utils/hook-mock");
  hooks = new Hooks();

  return mockReactHooks(origin, hooks);
});

jest.mock("../FormController", () => {
  const origin = jest.requireActual("../FormController");
  const { mockComponent } = require("./utils/clone-function");

  return {
    ...origin,
    FormControllerComponent: mockComponent(
      origin,
      "FormControllerComponent",
      hooks
    )
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("FormController", () => {
  it("Providing no properties", () => {
    render(
      <FormController validateOnChange>
        {() => <div data-testid={testid}></div>}
      </FormController>
    );

    expect(screen.getByTestId(testid)).toBeTruthy();
  });

  it("Providing wrong initialValues should throw an error", () => {
    const values = getGeneratedValues(false, "object", "class", "undefined");
    values.forEach((value) => {
      expect(() => {
        render(
          <FormController initialValues={value}>
            {() => {
              return <></>;
            }}
          </FormController>
        );
      }).toThrowError();
    });
  });

  it("Providing wrong onSubmit should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");
    values.forEach((value) => {
      expect(() => {
        render(
          <FormController onSubmit={value}>
            {() => {
              return <></>;
            }}
          </FormController>
        );
      }).toThrowError();
    });
  });

  it("Default functionality", () => {
    hooks.reset();

    let controller: Controller<Form> | undefined;
    let renderCount = 0;

    render(
      <FormControllerComponent<Form>>
        {(createdController) => {
          renderCount++;
          controller = createdController;
          return <div data-testid={testid}></div>;
        }}
      </FormControllerComponent>
    );

    expect(renderCount).toBe(1);
    expect(controller).not.toBeUndefined();

    const renderHooks = hooks.getHook("FormControllerComponent", "useEffect");
    expect(renderHooks?.length).toBe(2);
    expect(renderHooks?.[0]?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0]?.[1].action).toBeCalledTimes(1);

    expect(screen.getByTestId(testid)).toBeTruthy();

    const form = screen.getByRole("form");
    expect(form).toBeTruthy();

    expect(fireEvent.submit(form)).toBeFalsy();

    act(() => controller?.resetForm());
    expect(renderCount).toBe(2);
    expect(renderHooks?.length).toBe(2);
    expect(renderHooks?.[0]?.[0].action).toBeCalledTimes(1);
    expect(renderHooks?.[0]?.[1].action).toBeCalledTimes(1);
  });
});
