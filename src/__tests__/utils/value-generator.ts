type ValueTypes =
  | "array"
  | "bigint"
  | "boolean"
  | "class"
  | "float"
  | "function"
  | "integer"
  | "null"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

export class TestClass {}

/* istanbul ignore next */
export const getGeneratedValues = (
  include: boolean = true,
  ...types: ValueTypes[]
) => {
  const all = types.length === 0;
  const result: any[] = [];

  if (
    all ||
    (include && types.includes("array")) ||
    (!include && !types.includes("array"))
  ) {
    result.push([]);
    result.push([null]);
    result.push([""]);
    result.push([" "]);
    result.push(["string value"]);
    result.push([{}]);
    result.push([{ innerValue: "" }]);
    result.push([[]]);
    result.push([["string value"]]);
    result.push([[1, 2, 3]]);
    result.push([1.005]);
    result.push([1]);
    result.push([true]);
    result.push([function test() {}]);
    result.push([function () {}]);
    result.push([() => {}]);
    result.push([new TestClass()]);
    result.push([undefined]);
    result.push([BigInt(123)]);
    result.push([Symbol("symbol")]);
  }

  if (
    all ||
    (include && types.includes("bigint")) ||
    (!include && !types.includes("bigint"))
  ) {
    result.push(BigInt(0));
    result.push(BigInt(999));
    result.push(BigInt("123456789000"));
  }

  if (
    all ||
    (include && types.includes("boolean")) ||
    (!include && !types.includes("boolean"))
  ) {
    result.push(true);
    result.push(false);
  }

  if (
    all ||
    (include && types.includes("class")) ||
    (!include && !types.includes("class"))
  ) {
    result.push(new TestClass());
  }

  if (
    (include && types.includes("float") && !types.includes("number")) ||
    (!include && !(types.includes("float") || types.includes("number")) && !all)
  ) {
    result.push(0.0);
    result.push(-5.123);
    result.push(999.999);
  }

  if (
    all ||
    (include && types.includes("function")) ||
    (!include && !types.includes("function"))
  ) {
    result.push(function test() {});
    result.push(function () {});
    result.push(() => {});
  }

  if (
    (include && types.includes("integer") && !types.includes("number")) ||
    (!include &&
      !(types.includes("integer") || types.includes("number")) &&
      !all)
  ) {
    result.push(0);
    result.push(-5);
    result.push(999);
  }

  if (
    all ||
    (include && types.includes("null")) ||
    (!include && !types.includes("null"))
  ) {
    result.push(null);
  }

  if (
    all ||
    (include && types.includes("number")) ||
    (!include &&
      !(
        types.includes("number") ||
        types.includes("float") ||
        types.includes("integer")
      ))
  ) {
    result.push(0);
    result.push(-5);
    result.push(999);
    result.push(-5.123);
    result.push(999.999);
    result.push(NaN);
    result.push(Infinity);
  }

  if (
    all ||
    (include && types.includes("object")) ||
    (!include && !types.includes("object"))
  ) {
    result.push({});
    result.push({ someValue: null });
    result.push({ someValue: "" });
    result.push({ someValue: " " });
    result.push({ someValue: "string value" });
    result.push({ someValue: {} });
    result.push({ someValue: { innerValue: "" } });
    result.push({ someValue: [] });
    result.push({ someValue: ["string value"] });
    result.push({ someValue: [1, 2, 3] });
    result.push({ someValue: 1.005 });
    result.push({ someValue: 1 });
    result.push({ someValue: true });
    result.push({ someValue: function () {} });
    result.push({ someValue: () => {} });
    result.push({ someValue: new TestClass() });
    result.push({ someValue: undefined });
    result.push({ someValue: BigInt(123) });
    result.push({ someValue: Symbol("symbol") });
  }

  if (
    all ||
    (include && types.includes("string")) ||
    (!include && !types.includes("string"))
  ) {
    result.push("");
    result.push(" ");
    result.push("string value");
  }

  if (
    all ||
    (include && types.includes("symbol")) ||
    (!include && !types.includes("symbol"))
  ) {
    result.push(Symbol("symbol"));
  }

  if (
    all ||
    (include && types.includes("undefined")) ||
    (!include && !types.includes("undefined"))
  ) {
    result.push(undefined);
  }

  return result;
};
