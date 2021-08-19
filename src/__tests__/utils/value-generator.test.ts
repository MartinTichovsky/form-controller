import { getGeneratedValues, TestClass } from "./value-generator";

const totalCount = 61;

describe("Value Generator", () => {
  test("all", () => {
    let result;
    result = getGeneratedValues();
    expect(result.length).toBe(totalCount);
    result = getGeneratedValues(false);
    expect(result.length).toBe(totalCount);
  });

  test("Include all", () => {
    const result = getGeneratedValues(
      true,
      "array",
      "bigint",
      "boolean",
      "class",
      "float",
      "function",
      "integer",
      "null",
      "number",
      "object",
      "string",
      "symbol",
      "undefined"
    );
    expect(result.length).toBe(totalCount);
  });

  test("Exclude all", () => {
    const result = getGeneratedValues(
      false,
      "array",
      "bigint",
      "boolean",
      "class",
      "float",
      "function",
      "integer",
      "null",
      "number",
      "object",
      "string",
      "symbol",
      "undefined"
    );
    expect(result.length).toBe(0);
  });

  test("array", () => {
    let result;
    result = getGeneratedValues(true, "array");
    expect(result.every((item: []) => Array.isArray(item))).toBeTruthy();

    result = getGeneratedValues(false, "array");
    expect(result.every((item: []) => !Array.isArray(item))).toBeTruthy();
  });

  test("bigint", () => {
    let result;
    result = getGeneratedValues(true, "bigint");
    expect(
      result.every((item: BigInt) => typeof item === "bigint")
    ).toBeTruthy();

    result = getGeneratedValues(false, "bigint");
    expect(
      result.every((item: BigInt) => typeof item !== "bigint")
    ).toBeTruthy();
  });

  test("boolean", () => {
    let result;
    result = getGeneratedValues(true, "boolean");
    expect(
      result.every((item: Boolean) => typeof item === "boolean")
    ).toBeTruthy();

    result = getGeneratedValues(false, "boolean");
    expect(
      result.every((item: Boolean) => typeof item !== "boolean")
    ).toBeTruthy();
  });

  test("class", () => {
    let result;
    result = getGeneratedValues(true, "class");
    expect(
      result.every((item: TestClass) => item instanceof TestClass)
    ).toBeTruthy();

    result = getGeneratedValues(false, "class");
    expect(
      result.every((item: TestClass) => !(item instanceof TestClass))
    ).toBeTruthy();
  });

  test("float", () => {
    let result;
    result = getGeneratedValues(true, "float");
    expect(
      result.every(
        (item: number) =>
          item === 0.0 || item.toString().match(/^(-)?[0-9]+\.[0-9]+$/) !== null
      )
    ).toBeTruthy();

    result = getGeneratedValues(false, "float");
    expect(
      result.every(
        (item: number) =>
          item !== 0.0 || item.toString().match(/^(-)?[0-9]+\.[0-9]+$/) === null
      )
    ).toBeTruthy();
  });

  test("function", () => {
    let result;
    result = getGeneratedValues(true, "function");
    expect(
      result.every((item: Function) => typeof item === "function")
    ).toBeTruthy();

    result = getGeneratedValues(false, "function");
    expect(
      result.every((item: Function) => typeof item !== "function")
    ).toBeTruthy();
  });

  test("integer", () => {
    let result;
    result = getGeneratedValues(true, "integer");
    expect(
      result.every(
        (item: number) => typeof item === "number" && Number.isInteger(item)
      )
    ).toBeTruthy();

    result = getGeneratedValues(false, "integer", "number");
    expect(
      result.every(
        (item: number) => !(typeof item === "number" && Number.isInteger(item))
      )
    ).toBeTruthy();
  });

  test("null", () => {
    let result;
    result = getGeneratedValues(true, "null");
    expect(result.every((item: null) => item === null)).toBeTruthy();

    result = getGeneratedValues(false, "null");
    expect(result.every((item: null) => item !== null)).toBeTruthy();
  });

  test("number", () => {
    let result;
    result = getGeneratedValues(true, "number");
    expect(
      result.every((item: number) => typeof item === "number")
    ).toBeTruthy();

    result = getGeneratedValues(false, "number");
    expect(
      result.every((item: number) => typeof item !== "number")
    ).toBeTruthy();
  });

  test("object", () => {
    let result;
    result = getGeneratedValues(true, "object");
    expect(
      result.every(
        (item: Object) =>
          typeof item === "object" && item !== null && !Array.isArray(item)
      )
    ).toBeTruthy();

    result = getGeneratedValues(false, "object");
    expect(
      result.every(
        (item: Object) =>
          !(
            typeof item === "object" &&
            item !== null &&
            !Array.isArray(item)
          ) || item instanceof TestClass
      )
    ).toBeTruthy();
  });

  test("string", () => {
    let result;
    result = getGeneratedValues(true, "string");
    expect(
      result.every((item: string) => typeof item === "string")
    ).toBeTruthy();

    result = getGeneratedValues(false, "string");
    expect(
      result.every((item: string) => typeof item !== "string")
    ).toBeTruthy();
  });

  test("symbol", () => {
    let result;
    result = getGeneratedValues(true, "symbol");
    expect(
      result.every((item: symbol) => typeof item === "symbol")
    ).toBeTruthy();

    result = getGeneratedValues(false, "symbol");
    expect(
      result.every((item: symbol) => typeof item !== "symbol")
    ).toBeTruthy();
  });

  test("undefined", () => {
    let result;
    result = getGeneratedValues(true, "undefined");
    expect(result.every((item: undefined) => item === undefined)).toBeTruthy();

    result = getGeneratedValues(false, "undefined");
    expect(result.every((item: undefined) => item !== undefined)).toBeTruthy();
  });

  test("Multiple", () => {
    let result;
    result = getGeneratedValues(true, "string", "array");
    expect(
      result.every(
        (item: string | []) => typeof item === "string" || Array.isArray(item)
      )
    ).toBeTruthy();

    result = getGeneratedValues(false, "string", "array");
    expect(
      result.every(
        (item: string | []) => typeof item !== "string" && !Array.isArray(item)
      )
    ).toBeTruthy();
  });
});
