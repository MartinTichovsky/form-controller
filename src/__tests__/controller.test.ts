import { Controller } from "../controller";

type Form = {
  input: string;
};

describe("Controller - constructor", () => {
  it("setController", () => {
    let newController: Controller<{}> | undefined;
    const setController = jest.fn((controller) => {
      newController = controller;
    });
    const controller = new Controller({ setController });

    expect(controller.fields).toEqual({});
    expect(controller.isValid).toBeTruthy();
    expect(controller.key).toBe(0);
    expect(controller.validateOnChange).toBeFalsy();
    expect(controller.getField("name" as never)).toBeUndefined();
    expect(controller.getFieldValue("name" as never)).toBeUndefined();

    controller.resetForm();
    expect(setController).toBeCalledTimes(1);
    expect(newController).not.toEqual(controller);
    expect(newController?.key).toBe(1);
    expect(newController?.["_setController"]).toEqual(setController);
  });

  it("onSubmit", () => {
    let newController: Controller<{}> | undefined;
    let passedController: Controller<{}> | undefined;
    let passedFields: Partial<Form> | undefined;
    const value = "input value";

    const onSubmit = jest.fn((fields, controller) => {
      passedController = controller;
      passedFields = fields;
    });
    const setController = jest.fn((controller) => {
      newController = controller;
    });

    const onChange = jest.fn();
    const validate = jest.fn();

    const controller = new Controller<Form>({ onSubmit, setController });

    controller.onChange = onChange;
    controller.validate = validate;

    expect(controller.fields).toEqual({});
    expect(controller.isValid).toBeTruthy();

    controller.setFieldValue("input", value);
    expect(controller.fields).toEqual({ input: value });

    expect(controller.getField("input")).toEqual({
      isDisabled: false,
      isValid: true,
      value
    });
    expect(controller.getFieldValue("input")).toBe(value);

    controller.resetForm();
    expect(setController).toBeCalledTimes(1);
    expect(newController).not.toEqual(controller);
    expect(newController?.["_onSubmit"]).toEqual(onSubmit);

    expect(controller.isValid).toBeTruthy();
    expect(controller.submit()).toEqual(controller);
    expect(onSubmit).toBeCalledTimes(1);
    expect(controller.isSubmitted).toBeTruthy();
    expect(onChange).toBeCalledTimes(1);
    expect(validate).toBeCalledTimes(1);

    expect(passedController).toEqual(controller);
    expect(passedFields).toEqual({ input: value });
  });

  it("initialValues", () => {
    const initialValue = "initial value";
    const initialValues = { input: initialValue };
    const value = "inout value";
    let newController: Controller<Form> | undefined;

    const setController = jest.fn((controller) => {
      newController = controller;
    });

    const controller = new Controller({ initialValues, setController });

    expect(controller.fields).toEqual(initialValues);
    expect(controller.getField("input")).toEqual({
      isDisabled: false,
      isValid: true,
      value: initialValue
    });
    expect(controller.getFieldValue("input")).toBe(initialValue);

    controller.setFieldValue("input", value);

    expect(controller.fields).toEqual({ input: value });
    expect(controller.getField("input")).toEqual({
      isDisabled: false,
      isValid: true,
      value: value
    });
    expect(controller.getFieldValue("input")).toBe(value);

    controller.resetForm();
    expect(setController).toBeCalledTimes(1);
    expect(newController).not.toEqual(controller);
    expect(newController?.["_initialValues"]).toEqual(initialValues);
    expect(newController?.fields).toEqual(initialValues);
    expect(newController?.getField("input")).toEqual({
      isDisabled: false,
      isValid: true,
      value: initialValue
    });
    expect(newController?.getFieldValue("input")).toBe(initialValue);
  });

  it("validateOnChange", () => {
    let newController: Controller<Form> | undefined;

    const setController = jest.fn((controller) => {
      newController = controller;
    });
    const controller = new Controller<Form>({
      setController,
      validateOnChange: true
    });

    expect(controller.validateOnChange).toBeTruthy();

    const validateListener = jest.fn();
    controller.subscribeValidator("input", validateListener);

    expect(controller.isSubmitted).toBeFalsy();
    expect(controller.getField("input")?.isDisabled).toBeFalsy();

    expect(validateListener).not.toBeCalled();

    controller.setFieldValue("input", "new value");

    expect(validateListener).toBeCalledTimes(1);

    controller.resetForm();
    expect(setController).toBeCalledTimes(1);
    expect(newController).not.toEqual(controller);
    expect(newController?.["_validateOnChange"]).toBeTruthy();
  });
});
