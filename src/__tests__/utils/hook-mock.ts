type HookType =
  | "useCallback"
  | "useContext"
  | "useEffect"
  | "useMemo"
  | "useReducer"
  | "useRef"
  | "useState";

type Hook = {
  action?: jest.Mock;
  deps?: any[];
  unmountAction?: jest.Mock;
};

type Stack = {
  [key: string]: {
    [key in HookType]?: Hook[];
  };
};

export class Hooks {
  private _current?: string;
  stack: Stack = {};

  get current() {
    return this._current;
  }

  getAllHooks(componentName: string) {
    if (!(componentName in this.stack)) {
      return undefined;
    }

    return this.stack[componentName];
  }

  getHook(componentName: string, type: HookType) {
    if (
      !(componentName in this.stack) ||
      !(type in this.stack[componentName])
    ) {
      return undefined;
    }

    return this.stack[componentName][type];
  }

  reset() {
    this._current = undefined;
    this.stack = {};
  }

  registerHook(type: HookType) {
    if (!this.current) {
      return {
        current: undefined,
        index: undefined
      };
    }

    if (!(this.current in this.stack)) {
      this.stack[this.current] = {};
    }

    if (!(type in this.stack[this.current])) {
      this.stack[this.current][type] = [];
    }

    this.stack[this.current][type]!.push({});

    return {
      current: this.current,
      index: this.stack[this.current][type]!.length - 1
    };
  }

  setCurrent(functionName?: string) {
    if (functionName) {
      this._current = functionName;
    } else {
      this._current = undefined;
    }
  }

  setHook({
    current,
    index,
    props,
    type
  }: {
    current: string | undefined;
    index: number | undefined;
    props: Hook;
    type: HookType;
  }) {
    if (
      current === undefined ||
      index === undefined ||
      !(current in this.stack) ||
      !(type in this.stack[current]) ||
      this.stack[current][type]!.length <= index
    ) {
      return;
    }

    this.stack[current][type]![index] = {
      ...this.stack[current][type]![index],
      ...props
    };
  }
}

export const mockReactHooks = (origin: any, hooks: Hooks) => ({
  ...origin,
  useEffect: function (action: () => () => void, ...deps: any[]) {
    const { current, index } = hooks.registerHook("useEffect");

    const mockedAction = jest.fn(() => {
      const unmount = action();

      if (typeof unmount === "function") {
        const mockedUnmount = jest.fn(() => unmount());
        hooks.setHook({
          current,
          index,
          props: {
            unmountAction: mockedUnmount
          },
          type: "useEffect"
        });
        return mockedUnmount;
      }

      return unmount;
    });

    hooks.setHook({
      current,
      index,
      props: {
        action: mockedAction,
        deps
      },
      type: "useEffect"
    });

    return origin.useEffect(mockedAction, ...deps);
  }
});
