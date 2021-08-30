import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { ValidationProvider } from "../../providers";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { FieldContainer } from "../Field/FieldContainer";
import { InitialState } from "../Field/types";

type Form = {
  input: string;
  name: string;
  radio: string;
};

const testId = "test-id";
let controller: Controller<Form>;
let passedValues: {
  disableIf?: Function;
  hideIf?: Function;
  initialState?: InitialState;
  validate?: Function;
} = {};

jest.mock("../Field/Field", () => {
  const origin = jest.requireActual("../Field/Field");

  return {
    Field: function (...args: any[]) {
      passedValues = args[0];
      return origin.Field(...args);
    }
  };
});

console.error = jest.fn();

beforeEach(() => {
  passedValues = {};
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("FieldContainer", () => {
  test("Default functionality", () => {
    render(
      <FieldContainer<
        Form,
        "input",
        any,
        any,
        HTMLInputElement,
        React.InputHTMLAttributes<HTMLInputElement>
      >
        controller={controller}
        data-testid={testId}
        fieldType="input"
        name="input"
      />
    );

    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  test("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={value}
            fieldType="input"
            name="input"
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong disableIf should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            disableIf={value}
            fieldType="input"
            name="input"
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong name should throw an error", () => {
    const values = getGeneratedValues(false, "string");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name={value}
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong onFormChange should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
            onFormChange={value}
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong validate should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
            validate={value}
          />
        );
      }).toThrowError();
    });
  });

  describe("Name checking", () => {
    test("Providing different name or radios with same name should not log a warning", () => {
      console.warn = jest.fn();

      render(
        <>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer<
            Form,
            "name",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="name"
          />
          <FieldContainer<
            Form,
            "radio",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            label="radio 1"
            name="radio"
            type="radio"
            value="radio-1"
          />
          <FieldContainer<
            Form,
            "radio",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            label="radio 2"
            name="radio"
            type="radio"
            value="radio-2"
          />
        </>
      );

      expect(console.warn).not.toBeCalled();
    });

    test("Providing same name should log a warning", () => {
      console.warn = jest.fn();

      expect(console.warn).not.toBeCalled();

      render(
        <>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
        </>
      );

      expect(console.warn).toBeCalled();
    });

    test("Providing same name should log a warning - test with radio", () => {
      console.warn = jest.fn();

      expect(console.warn).not.toBeCalled();

      render(
        <>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            label="radio 2"
            name="input"
            type="radio"
            value="radio-2"
          />
        </>
      );

      expect(console.warn).toBeCalled();
    });
  });

  describe("disableIf", () => {
    const disableIfController = jest.fn();
    const disableIfPassed = jest.fn();
    const disableIfProvider = jest.fn();

    test("DisableIf should be passed", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          disableIf={disableIfPassed}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.disableIf).toEqual(disableIfPassed);
    });

    test("Get disableIf from controller", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.disableIf).toEqual(disableIfController);
    });

    test("Get disableIf from provider", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <ValidationProvider disableIf={disableIfProvider}>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.disableIf).toEqual(disableIfProvider);
    });
  });

  describe("hideIf", () => {
    const hideIfController = jest.fn();
    const hideIfPassed = jest.fn();
    const hideIfProvider = jest.fn();

    test("HideIf should be passed", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          hideIf={hideIfPassed}
          name="input"
        />
      );

      expect(passedValues.hideIf).toEqual(hideIfPassed);
    });

    test("Get hideIf from controller", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.hideIf).toEqual(hideIfController);
    });

    test("Get hideIf from provider", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <ValidationProvider hideIf={hideIfProvider}>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.hideIf).toEqual(hideIfProvider);
    });
  });

  describe("validate", () => {
    const validateController = jest.fn();
    const validatePassed = jest.fn();
    const validateProvider = jest.fn();

    test("HideIf should be passed", () => {
      controller["_validation"] = { input: validateController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
          validate={validatePassed}
        />
      );

      expect(passedValues.validate).toEqual(validatePassed);
    });

    test("Get hideIf from controller", () => {
      controller["_validation"] = { input: validateController };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.validate).toEqual(validateController);
    });

    test("Get validation from provider", () => {
      controller["_validation"] = { input: validateController };

      render(
        <ValidationProvider validate={validateProvider}>
          <FieldContainer<
            Form,
            "input",
            any,
            any,
            HTMLInputElement,
            React.InputHTMLAttributes<HTMLInputElement>
          >
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.validate).toEqual(validateProvider);
    });
  });

  describe("initialState", () => {
    test("Default", () => {
      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: true,
        isVisible: true
      });
    });

    test("IsDisabled", () => {
      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          disableIf={() => true}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: true,
        isValid: true,
        isVisible: true
      });
    });

    test("IsValid - from validate", () => {
      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
          validate={() => false}
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: false,
        isVisible: true
      });
    });

    test("IsValid - from controller", () => {
      controller["_fields"].input = {
        isDisabled: false,
        isValid: false,
        isValidated: true,
        isVisible: true,
        validationInProgress: false,
        validationResult: undefined,
        value: undefined
      };

      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: false,
        isVisible: true
      });
    });

    test("IsVisible", () => {
      render(
        <FieldContainer<
          Form,
          "input",
          any,
          any,
          HTMLInputElement,
          React.InputHTMLAttributes<HTMLInputElement>
        >
          controller={controller}
          fieldType="input"
          hideIf={() => true}
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: true,
        isVisible: false
      });
    });
  });
});
