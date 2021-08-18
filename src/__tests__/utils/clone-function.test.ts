it("Clone function", () => {
  expect(Function.prototype["clone"]).toBeUndefined();
  require("./clone-function");
  expect(Function.prototype["clone"]).not.toBeUndefined();
});
