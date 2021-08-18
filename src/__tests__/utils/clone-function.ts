import { Hooks } from "./hook-mock";

/* istanbul ignore next */
if (!("clone" in Function.prototype)) {
  Function.prototype["clone"] = function (hooks: Hooks) {
    const _this = this;
    const _overload = function overload() {
      if (!arguments.length) {
        return undefined;
      }

      hooks.setCurrent(_this.name);

      return _this.apply(_this, arguments);
    };

    return _overload;
  };
}

export const mockComponent =
  (origin: any, componentName: string, hooks: Hooks) =>
  (...props: any[]) => {
    const result = origin[componentName].clone(hooks)(...props);
    hooks.setCurrent(undefined);
    return result;
  };
