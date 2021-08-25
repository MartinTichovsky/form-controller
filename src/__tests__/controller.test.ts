// import { Controller } from "../controller";

// type Form = {
//   input: string;
// };

// describe("Controller - constructor", () => {
//   it("setController", () => {
//     let newController: Controller<{}> | undefined;
//     const setController = jest.fn((controller) => {
//       newController = controller;
//     });
//     const controller = new Controller({ setController });

//     expect(controller.fields).toEqual({});
//     expect(controller.isValid).toBeTruthy();
//     expect(controller.key).toBe(0);
//     expect(controller.validateOnChange).toBeFalsy();
//     expect(controller.getField("name" as never)).toBeUndefined();
//     expect(controller.getFieldValue("name" as never)).toBeUndefined();

//     controller.resetForm();
//     expect(setController).toBeCalledTimes(1);
//     expect(newController).not.toEqual(controller);
//     expect(newController?.key).toBe(1);
//     expect(newController?.["_setController"]).toEqual(setController);
//   });

//   it("onSubmit", () => {
//     let newController: Controller<{}> | undefined;
//     const value = "input value";

//     const onSubmit = jest.fn();
//     const setController = jest.fn((controller) => {
//       newController = controller;
//     });

//     const onChange = jest.fn();
//     const validate = jest.fn();

//     const controller = new Controller<Form>({ onSubmit, setController });

//     controller.onChange = onChange;
//     controller.validate = validate;

//     expect(controller.fields).toEqual({});
//     expect(controller.isValid).toBeTruthy();

//     controller.setFieldValue("input", value);
//     expect(controller.fields).toEqual({ input: value });

//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value
//     });
//     expect(controller.getFieldValue("input")).toBe(value);

//     controller.resetForm();
//     expect(setController).toBeCalledTimes(1);
//     expect(newController).not.toEqual(controller);
//     expect(newController?.["_onSubmit"]).toEqual(onSubmit);

//     expect(controller.isValid).toBeTruthy();
//     expect(controller.submit()).toEqual(controller);
//     expect(onSubmit).toBeCalledTimes(1);
//     expect(controller.isSubmitted).toBeTruthy();
//     expect(onChange).toBeCalledTimes(1);
//     expect(validate).toBeCalledTimes(1);
//     expect(onSubmit).toBeCalledWith({ input: value }, controller);
//   });

//   it("initialValues", () => {
//     const initialValue = "initial value";
//     const initialValues = { input: initialValue };
//     const value = "inout value";
//     let newController: Controller<Form> | undefined;

//     const setController = jest.fn((controller) => {
//       newController = controller;
//     });

//     const controller = new Controller({ initialValues, setController });

//     expect(controller.fields).toEqual(initialValues);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value: initialValue
//     });
//     expect(controller.getFieldValue("input")).toBe(initialValue);

//     controller.setFieldValue("input", value);

//     expect(controller.fields).toEqual({ input: value });
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value: value
//     });
//     expect(controller.getFieldValue("input")).toBe(value);

//     controller.resetForm();
//     expect(setController).toBeCalledTimes(1);
//     expect(newController).not.toEqual(controller);
//     expect(newController?.["_initialValues"]).toEqual(initialValues);
//     expect(newController?.fields).toEqual(initialValues);
//     expect(newController?.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value: initialValue
//     });
//     expect(newController?.getFieldValue("input")).toBe(initialValue);
//   });

//   it("validateOnChange", () => {
//     let newController: Controller<Form> | undefined;

//     const setController = jest.fn((controller) => {
//       newController = controller;
//     });
//     const controller = new Controller<Form>({
//       setController,
//       validateOnChange: true
//     });

//     expect(controller.validateOnChange).toBeTruthy();

//     const validateListener = jest.fn();
//     controller.subscribeValidator("input", validateListener);

//     expect(controller.isSubmitted).toBeFalsy();
//     expect(controller.getField("input")?.isDisabled).toBeFalsy();

//     expect(validateListener).not.toBeCalled();

//     controller.setFieldValue("input", "new value");

//     expect(validateListener).toBeCalledTimes(1);

//     controller.resetForm();
//     expect(setController).toBeCalledTimes(1);
//     expect(newController).not.toEqual(controller);
//     expect(newController?.["_validateOnChange"]).toBeTruthy();
//   });
// });

// describe("Controller - methods", () => {
//   it("disableFields, subscribeOnDisable, subscribeOnDisableButton", () => {
//     const setController = jest.fn();
//     const controller = new Controller<Form>({
//       setController
//     });

//     const onDisableListener = jest.fn();
//     const onDisableButtonListener = jest.fn();

//     controller.setFieldValue("input", "input value");

//     controller.subscribeOnDisable("input", onDisableListener);
//     controller.subscribeOnDisableButton(onDisableButtonListener);

//     expect(controller["onDisableListeners"].size).toBe(1);
//     expect(controller["onDisableListeners"].get("input")).toEqual(
//       onDisableListener
//     );
//     expect(controller["onDisableButtonListeners"].size).toBe(1);
//     expect(
//       controller["onDisableButtonListeners"].has(onDisableButtonListener)
//     ).toBeTruthy();

//     controller.disableFields(true);
//     expect(onDisableListener).toHaveBeenCalledTimes(1);
//     expect(onDisableListener).toBeCalledWith(true);
//     expect(onDisableButtonListener).toHaveBeenCalledTimes(1);
//     expect(onDisableButtonListener).toBeCalledWith(true);

//     controller.disableFields(false);
//     expect(onDisableListener).toHaveBeenCalledTimes(2);
//     expect(onDisableListener).toBeCalledWith(false);
//     expect(onDisableButtonListener).toHaveBeenCalledTimes(2);
//     expect(onDisableButtonListener).toBeCalledWith(false);

//     jest.resetAllMocks();

//     controller.setIsDisabled("input", true);

//     controller.disableFields(true);
//     expect(onDisableListener).not.toBeCalled();

//     controller.unsubscribeOnDisable("input");
//     controller.unsubscribeOnDisableButton(onDisableButtonListener);
//     expect(controller["onDisableListeners"].size).toBe(0);
//     expect(controller["onDisableButtonListeners"].size).toBe(0);
//   });

//   it("onChange", () => {
//     const setController = jest.fn();
//     const controller = new Controller<Form>({
//       setController
//     });

//     const onChangeListener = jest.fn();
//     controller.subscribeOnChange(onChangeListener);
//     expect(controller["onChangeListeners"].size).toBe(1);
//     expect(controller["onChangeListeners"].has(onChangeListener)).toBeTruthy();

//     controller.setFieldValue("input", "input value 1");

//     controller.subscribeValidator("input", () => false);

//     expect(onChangeListener).toBeCalledTimes(1);
//     expect(onChangeListener).toBeCalledWith(true);

//     controller.validate();

//     expect(onChangeListener).toBeCalledTimes(2);
//     expect(onChangeListener).toBeCalledWith(false);

//     controller.unsubscribeOnChange(onChangeListener);
//     expect(controller["onChangeListeners"].size).toBe(0);
//   });

//   it("setFieldValue", () => {
//     const value = "input value";
//     const setController = jest.fn();

//     const controller = new Controller<Form>({
//       setController
//     });

//     const validatorListener = jest.fn(
//       () => controller.getFieldValue("input") !== ""
//     );

//     expect(controller.getField("input")).toBeUndefined();
//     expect(controller.getFieldValue("input")).toBeUndefined();

//     controller.subscribeValidator("input", validatorListener);

//     controller.setFieldValue("input", value);

//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value
//     });

//     expect(controller.getFieldValue("input")).toBe(value);

//     expect(validatorListener).toHaveBeenCalledTimes(1);
//     expect(validatorListener).toBeCalledWith(true);

//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value
//     });

//     controller.isSubmitted = true;
//     controller.setFieldValue("input", "new value 1");
//     expect(validatorListener).toHaveBeenCalledTimes(2);
//     expect(validatorListener).toBeCalledWith();

//     controller.isSubmitted = false;
//     controller["_validateOnChange"] = true;
//     controller.setFieldValue("input", "new value 2");
//     expect(validatorListener).toHaveBeenCalledTimes(3);
//     expect(validatorListener).toBeCalledWith();

//     controller.isSubmitted = true;
//     controller["_fields"].input.isDisabled = true;
//     controller.setFieldValue("input", "new value 3");
//     expect(validatorListener).toHaveBeenCalledTimes(3);

//     expect(controller.getField("input")?.isValid).toBeTruthy();

//     controller.setFieldValue("input", "");
//     expect(controller.getField("input")?.isValid).toBeTruthy();

//     controller["_fields"].input.isDisabled = false;
//     controller.setFieldValue("input", "");
//     expect(controller.getField("input")?.isValid).toBeFalsy();

//     controller.unsubscribeValidator("input");
//     controller.setFieldValue("input", "");
//     expect(controller.getField("input")?.isValid).toBeTruthy();
//   });

//   it("setIsDisabled", () => {
//     const value = "input value";
//     const setController = jest.fn();

//     const controller = new Controller<Form>({
//       setController
//     });

//     controller.setFieldValue("input", value);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value
//     });

//     controller.setIsDisabled("input", false);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value
//     });

//     controller["_fields"].input.value = value;

//     controller.setIsDisabled("input", true);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: true,
//       isValid: true,
//       value: undefined
//     });

//     controller.setIsDisabled("input", false);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: true,
//       value: undefined
//     });

//     controller["_fields"].input.isValid = false;
//     controller["_fields"].input.value = value;

//     controller.setIsDisabled("input", false);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: false,
//       isValid: false,
//       value
//     });

//     const validatorListener1 = jest.fn(() => true);

//     controller.subscribeValidator("input", validatorListener1);

//     controller["_fields"].input.value = value;

//     controller.setIsDisabled("input", true);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: true,
//       isValid: true,
//       value: undefined
//     });

//     expect(validatorListener1).toHaveBeenCalledTimes(1);
//     expect(validatorListener1).toBeCalledWith(true);

//     const validatorListener2 = jest.fn(() => false);
//     controller.subscribeValidator("input", validatorListener2);

//     controller.setIsDisabled("input", true);
//     expect(controller.getField("input")).toEqual({
//       isDisabled: true,
//       isValid: false,
//       value: undefined
//     });

//     expect(validatorListener2).toHaveBeenCalledTimes(1);
//     expect(validatorListener2).toBeCalledWith(true);
//   });

//   it("submit", () => {
//     const onSubmit = jest.fn();
//     const setController = jest.fn();

//     const controller = new Controller<Form>({
//       onSubmit,
//       setController
//     });

//     controller.setFieldValue("input", "some value");
//     expect(onSubmit).not.toBeCalled();

//     controller.submit();
//     expect(controller.isSubmitted).toBeTruthy();
//     expect(onSubmit).toBeCalledTimes(1);
//     expect(onSubmit).toBeCalledWith(
//       { input: controller.getFieldValue("input") },
//       controller
//     );

//     controller["_fields"].input.isValid = false;
//     controller.submit();
//     expect(onSubmit).toBeCalledTimes(1);
//   });
// });
it("Disable for now", () => {});
