import { ReactHooksCollector } from "./react-hooks-collector";

/* istanbul ignore next */
if (!("clone" in Function.prototype)) {
  Function.prototype["clone"] = function (hooksCollector: ReactHooksCollector) {
    const _this = this;
    const _overload = {
      [_this.name]: function () {
        if (!arguments.length) {
          return undefined;
        }

        hooksCollector.componentRender(_this.name);

        return _this.apply(_this, arguments);
      }
    };

    Object.defineProperty(_overload[_this.name], "name", {
      value: _this.name
    });

    return _overload[_this.name];
  };
}

export const mockComponent = (
  origin: any,
  componentName: string,
  hooks: ReactHooksCollector
) => origin[componentName].clone(hooks);
