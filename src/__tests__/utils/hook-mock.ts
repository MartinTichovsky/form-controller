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
  }[];
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
    if (!(componentName in this.stack) || !this.stack[componentName].length) {
      return undefined;
    }

    return this.stack[componentName].map((item) => item[type]);
  }

  reset() {
    this._current = undefined;
    this.stack = {};
  }

  registerHook(type: HookType) {
    if (!this.current) {
      return {
        current: undefined,
        currentIndex: undefined,
        index: undefined
      };
    }

    if (!(this.current in this.stack)) {
      this.stack[this.current] = [{}];
    }

    if (
      !(type in this.stack[this.current][this.stack[this.current].length - 1])
    ) {
      this.stack[this.current][this.stack[this.current].length - 1][type] = [];
    }

    this.stack[this.current][this.stack[this.current].length - 1][type]!.push(
      {}
    );

    return {
      current: this.current,
      currentIndex: this.stack[this.current].length - 1,
      index:
        this.stack[this.current][this.stack[this.current].length - 1][type]!
          .length - 1
    };
  }

  setCurrent(functionName?: string) {
    if (!functionName) {
      this._current = undefined;
      return;
    }

    this._current = functionName;

    if (!(functionName in this.stack)) {
      this.stack[functionName] = [];
    }

    this.stack[functionName].push({});
  }

  setHook({
    current,
    currentIndex,
    index,
    props,
    type
  }: {
    current: string | undefined;
    currentIndex?: number;
    index: number | undefined;
    props: Hook;
    type: HookType;
  }) {
    if (
      current === undefined ||
      currentIndex === undefined ||
      index === undefined ||
      !(current in this.stack) ||
      !this.stack[current].length ||
      this.stack[current].length <= currentIndex ||
      !(type in this.stack[current][currentIndex]) ||
      this.stack[current][currentIndex][type]!.length <= index
    ) {
      return;
    }

    this.stack[current][currentIndex][type]![index] = {
      ...this.stack[current][currentIndex][type]![index],
      ...props
    };
  }
}

export const mockReactHooks = (origin: any, hooks: Hooks) => ({
  ...origin,
  useEffect: function (action: () => () => void, ...deps: any[]) {
    const { current, currentIndex, index } = hooks.registerHook("useEffect");

    const mockedAction = jest.fn(() => {
      const unmount = action();

      if (typeof unmount === "function") {
        const mockedUnmount = jest.fn(() => unmount());
        hooks.setHook({
          current,
          currentIndex,
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
      currentIndex,
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
