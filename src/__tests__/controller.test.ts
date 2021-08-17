import { Controller } from "../controller";

describe("Controller", () => {
  let newController: Controller<{}> | undefined;
  const setController = jest.fn((controller) => {
    newController = controller;
  });
  const controller = new Controller({ setController });

  it("No properties passed", () => {
    expect(controller.fields).toEqual({});
    expect(controller.isValid).toBeTruthy();
    expect(controller.key).toBe(0);
    expect(controller.validateOnChange).toBeFalsy();
    expect(controller.getField("name" as never)).toBeUndefined();
    expect(controller.getFieldValue("name" as never)).toBeUndefined();

    controller.resetForm();
    expect(setController).toBeCalledTimes(1);
    expect(newController?.key).toBe(1);
  });
});
