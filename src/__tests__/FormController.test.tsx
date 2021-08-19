import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../controller";
import { FormController, FormControllerComponent } from "../FormController";
import { ReactHooksCollector } from "./utils/react-hooks-collector";
import { getGeneratedValues } from "./utils/value-generator";

type Form = {
  input: string;
};

const testid = "test-id";
let hooksCollector: ReactHooksCollector;

// mocking react to get statistics from calling hooks
jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const {
    mockReactHooks,
    ReactHooksCollector
  } = require("./utils/react-hooks-collector");
  hooksCollector = new ReactHooksCollector();

  return mockReactHooks(origin, hooksCollector);
});

// mocking the component to get statistics of render count
jest.mock("../FormController", () => {
  const origin = jest.requireActual("../FormController");
  const { mockComponent } = require("./utils/clone-function");

  return {
    ...origin,
    FormControllerComponent: mockComponent(
      origin,
      origin.FormControllerComponent.name,
      hooksCollector
    )
  };
});

console.error = jest.fn();

afterAll(() => {
  jest.restoreAllMocks();
});

describe("FormController Element", () => {
  test("Default functionality", () => {
    render(
      <FormController>{() => <div data-testid={testid}></div>}</FormController>
    );

    expect(screen.getByTestId(testid)).toBeTruthy();
  });

  test("Default functionality with validate on change", () => {
    render(
      <FormController validateOnChange>
        {() => <div data-testid={testid}></div>}
      </FormController>
    );

    expect(screen.getByTestId(testid)).toBeTruthy();
  });

  test("Providing wrong initialValues should throw an error", () => {
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

  test("Providing wrong onSubmit should throw an error", () => {
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
});

describe("FormControllerComponent Element", () => {
  test("Default functionality", () => {
    hooksCollector.reset();

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

    const useEffectHooks = hooksCollector.getRegisteredComponentHook(
      FormControllerComponent.name,
      "useEffect"
    );

    // must be rendered once and passed controller must not be undefined
    expect(
      hooksCollector.getComponentRenderCount(FormControllerComponent.name)
    ).toBe(2);
    expect(renderCount).toBe(1);
    expect(controller).not.toBeUndefined();

    // first render should call the actions
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);

    // the test component must exist
    expect(screen.getByTestId(testid)).toBeTruthy();

    // a form must exist and submiting the form must return false
    const form = screen.getByRole("form");

    expect(form).toBeTruthy();
    expect(fireEvent.submit(form)).toBeFalsy();

    // all other hooks mustn't be called
    const registeredHooks = hooksCollector.getRegisteredComponentHooks(
      FormControllerComponent.name
    );

    registeredHooks
      ?.map((hook) => hook.useEffect)
      .flat()
      ?.slice(1)
      .forEach((renderHook) => {
        if (renderHook) {
          expect(renderHook.action).not.toBeCalled();
        }
      });

    // reset the form
    act(() => controller?.resetForm());
    expect(renderCount).toBe(2);
    expect(
      hooksCollector.getComponentRenderCount(FormControllerComponent.name)
    ).toBe(3);
    expect(useEffectHooks?.getRenderHooks(1, 1)?.action).toBeCalledTimes(1);
  });
});
