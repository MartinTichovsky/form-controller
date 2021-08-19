import { deepClone, isObject } from "../deep-clone";

describe("Deep clone object", () => {
  test("Object with one level", () => {
    const originObject = { string: "string", number: 5, boolean: true };
    const clonedObject = deepClone(originObject);

    clonedObject.string = "new string";
    clonedObject.number = 10;
    clonedObject.boolean = false;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.string).not.toBe(clonedObject.string);
    expect(originObject.number).not.toBe(clonedObject.number);
    expect(originObject.boolean).not.toBe(clonedObject.boolean);
  });

  test("Object with two levels", () => {
    const originObject = {
      object: {
        string: "string",
        number: 5,
        boolean: true
      }
    };
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject.object.string = "new string";
    clonedObject.object.number = 10;
    clonedObject.object.boolean = false;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.object.string).not.toBe(clonedObject.object.string);
    expect(originObject.object.number).not.toBe(clonedObject.object.number);
    expect(originObject.object.boolean).not.toBe(clonedObject.object.boolean);
  });

  test("Object with tree levels", () => {
    const originObject = {
      object: {
        object: {
          string: "string",
          number: 5,
          boolean: true
        }
      }
    };
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject.object.object.string = "new string";
    clonedObject.object.object.number = 10;
    clonedObject.object.object.boolean = false;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.object.object.string).not.toBe(
      clonedObject.object.object.string
    );
    expect(originObject.object.object.number).not.toBe(
      clonedObject.object.object.number
    );
    expect(originObject.object.object.boolean).not.toBe(
      clonedObject.object.object.boolean
    );
  });

  test("Object with array of numbers", () => {
    const originObject = { array: [1, 2, 3] };
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject.array[0] = 5;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.array[0]).not.toBe(clonedObject.array[0]);
  });

  test("Object with double array", () => {
    const originObject = { array: [[1, 2, 3]] };
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject.array[0][0] = 5;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.array[0][0]).not.toBe(clonedObject.array[0][0]);
  });

  test("Object with array of objects", () => {
    const originObject = {
      array: [{ string: "string", number: 5, boolean: true }]
    };
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject.array[0].string = "new string";
    clonedObject.array[0].number = 10;
    clonedObject.array[0].boolean = false;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject.array[0].string).not.toBe(clonedObject.array[0].string);
    expect(originObject.array[0].number).not.toBe(clonedObject.array[0].number);
    expect(originObject.array[0].boolean).not.toBe(
      clonedObject.array[0].boolean
    );
  });

  test("Array with numbers", () => {
    const originObject = [1, 2, 3];
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject[0] = 5;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject[0]).not.toBe(clonedObject[0]);
  });

  test("Double array", () => {
    const originObject = [[1, 2, 3]];
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject[0][0] = 5;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject[0][0]).not.toBe(clonedObject[0][0]);
  });

  test("Array of objects", () => {
    const originObject = [{ string: "string", number: 5, boolean: true }];
    const clonedObject = deepClone(originObject);

    expect(originObject).toEqual(clonedObject);

    clonedObject[0].string = "new string";
    clonedObject[0].number = 10;
    clonedObject[0].boolean = false;

    expect(originObject).not.toEqual(clonedObject);
    expect(originObject[0].string).not.toBe(clonedObject[0].string);
    expect(originObject[0].number).not.toBe(clonedObject[0].number);
    expect(originObject[0].boolean).not.toBe(clonedObject[0].boolean);
  });

  test("Passing non object value", () => {
    expect(deepClone("string")).toBe("string");
    expect(deepClone(true)).toBe(true);
    expect(deepClone(5)).toBe(5);
  });
});

describe("isObject", () => {
  class TestClass {}

  test("Should return false", () => {
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject("string")).toBeFalsy();
    expect(isObject(5)).toBeFalsy();
    expect(isObject([])).toBeFalsy();
    expect(isObject([5])).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
    expect(isObject(Infinity)).toBeFalsy();
    expect(isObject(BigInt(123))).toBeFalsy();
    expect(isObject(Symbol("symbol"))).toBeFalsy();
  });

  test("Should return true", () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ someProperty: "" })).toBeTruthy();
    expect(isObject(new TestClass())).toBeTruthy();
  });
});
