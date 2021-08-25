import { ReactHooksCollector } from "./react-hooks-collector";

/* istanbul ignore next */
if (!("clone" in Function.prototype)) {
  Function.prototype["clone"] = function (hooksCollector: ReactHooksCollector) {
    const _this = this;
    const _overload = {
      // this scope will be called on each render
      [_this.name]: function () {
        if (!arguments.length) {
          return undefined;
        }

        hooksCollector.componentRender(
          _this.name,
          arguments?.[0]?.["data-testid"]
        );

        const result = _this.apply(_this, arguments);
        hooksCollector.componentUnmount();

        return result;
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
