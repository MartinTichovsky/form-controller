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

type ComponentHooks = {
  [key in HookType]?: Hook[];
};

export class ReactHooksCollector {
  registeredComponents: {
    [key: string]: ComponentHooks[];
  } = {};

  unregisteredComponents: {
    [key: string]: ComponentHooks;
  } = {};

  private createUregisteredComponent(componentName: string, type: HookType) {
    if (!(componentName in this.unregisteredComponents)) {
      this.unregisteredComponents[componentName] = {};
    }

    if (!(type in this.unregisteredComponents[componentName])) {
      this.unregisteredComponents[componentName][type] = [];
    }

    this.unregisteredComponents[componentName][type]!.push({});

    return {
      index: this.unregisteredComponents[componentName][type]!.length - 1,
      renderIndex: undefined
    };
  }

  componentRender(componentName?: string) {
    if (componentName === undefined) {
      return;
    }

    if (!(componentName in this.registeredComponents)) {
      this.registeredComponents[componentName] = [];
    }

    this.registeredComponents[componentName].push({});
  }

  getComponentRenderCount(componentName: string) {
    return this.registeredComponents[componentName]?.length || 0;
  }

  getRegisteredComponentHooks(componentName: string) {
    if (!(componentName in this.registeredComponents)) {
      return undefined;
    }

    return this.registeredComponents[componentName];
  }

  getRegisteredComponentHook(componentName: string, type: HookType) {
    if (
      !(componentName in this.registeredComponents) ||
      !this.registeredComponents[componentName].length
    ) {
      return undefined;
    }

    return {
      getRender: (renderNumber: number) => {
        return !this.registeredComponents[componentName].length ||
          renderNumber > this.registeredComponents[componentName].length
          ? undefined
          : this.registeredComponents[componentName][renderNumber - 1][type];
      },
      getRenderHooks: (renderNumber: number, hookNumber: number) => {
        return !this.registeredComponents[componentName].length ||
          renderNumber > this.registeredComponents[componentName].length
          ? undefined
          : !this.registeredComponents[componentName][renderNumber - 1][type] ||
            !this.registeredComponents[componentName][renderNumber - 1][type]!
              .length ||
            hookNumber >
              this.registeredComponents[componentName][renderNumber - 1][type]!
                .length
          ? undefined
          : this.registeredComponents[componentName][renderNumber - 1][type]![
              hookNumber - 1
            ];
      }
    };
  }

  getUnregisteredComponentHooks(componentName: string) {
    if (!(componentName in this.unregisteredComponents)) {
      return undefined;
    }

    return this.unregisteredComponents[componentName];
  }

  getUnregisteredComponentHook(componentName: string, type: HookType) {
    if (
      !(componentName in this.unregisteredComponents) ||
      !(type in this.unregisteredComponents[componentName])
    ) {
      return undefined;
    }

    return {
      getHook: (hookNumber: number) => {
        if (
          !this.unregisteredComponents[componentName][type]!.length ||
          hookNumber > this.unregisteredComponents[componentName][type]!.length
        ) {
          return undefined;
        }

        return this.unregisteredComponents[componentName][type]![
          hookNumber - 1
        ];
      }
    };
  }

  registerHook(componentName: string, type: HookType) {
    if (!(componentName in this.registeredComponents)) {
      return this.createUregisteredComponent(componentName, type);
    }

    if (
      !(
        type in
        this.registeredComponents[componentName][
          this.registeredComponents[componentName].length - 1
        ]
      )
    ) {
      this.registeredComponents[componentName][
        this.registeredComponents[componentName].length - 1
      ][type] = [];
    }

    this.registeredComponents[componentName][
      this.registeredComponents[componentName].length - 1
    ][type]!.push({});

    return {
      index:
        this.registeredComponents[componentName][
          this.registeredComponents[componentName].length - 1
        ][type]!.length - 1,
      renderIndex: this.registeredComponents[componentName].length - 1
    };
  }

  reset() {
    this.registeredComponents = {};
    this.unregisteredComponents = {};
  }

  setHook({
    componentName,
    index,
    props,
    renderIndex,
    type
  }: {
    componentName: string | undefined;
    index: number | undefined;
    props: Hook;
    renderIndex: number | undefined;
    type: HookType;
  }) {
    if (componentName === undefined || index === undefined) {
      return;
    }

    // check unregistered integrity
    if (
      renderIndex === undefined &&
      (!(componentName in this.unregisteredComponents) ||
        !(type in this.unregisteredComponents[componentName]) ||
        !this.unregisteredComponents[componentName][type]!.length ||
        this.unregisteredComponents[componentName][type]!.length <= index)
    ) {
      return;
    }

    // push into unregistered component
    if (renderIndex === undefined) {
      this.unregisteredComponents[componentName][type]![index] = {
        ...this.unregisteredComponents[componentName][type]![index],
        ...props
      };
      return;
    }

    // check registered integrity
    if (
      !(componentName in this.registeredComponents) ||
      !this.registeredComponents[componentName].length ||
      this.registeredComponents[componentName].length <= renderIndex ||
      !(type in this.registeredComponents[componentName][renderIndex]) ||
      !this.registeredComponents[componentName][renderIndex][type]!.length ||
      this.registeredComponents[componentName][renderIndex][type]!.length <=
        index
    ) {
      return;
    }

    this.registeredComponents[componentName][renderIndex][type]![index] = {
      ...this.registeredComponents[componentName][renderIndex][type]![index],
      ...props
    };
  }
}

export const mockReactHooks = (
  origin: any,
  hooksCollector: ReactHooksCollector
) => ({
  ...origin,
  useCallback: function useCallback(
    action: (...props: any[]) => void,
    ...deps: any[]
  ) {
    let componentName: string;

    // get caller function name from error stack since Funcion.caller is deprecated
    try {
      throw new Error();
    } catch (ex) {
      const functionsMatches = ex.stack.match(
        /(\w+)@|at (Function\.)?(\w+) \(/g
      );
      const parentFunctionMatches = functionsMatches[0].match(
        /(\w+)@|at (Function\.)?(\w+) \(/
      );
      componentName = parentFunctionMatches[1] || parentFunctionMatches[3];
    }

    const { index, renderIndex } = hooksCollector.registerHook(
      componentName,
      "useCallback"
    );

    const mockedAction = jest.fn((...props) => action(...props));

    hooksCollector.setHook({
      componentName,
      index,
      props: {
        action: mockedAction,
        deps
      },
      renderIndex,
      type: "useCallback"
    });

    return origin.useCallback(mockedAction, ...deps);
  },
  useEffect: function useEffect(action: () => () => void, ...deps: any[]) {
    let componentName: string;

    // get caller function name from error stack since Funcion.caller is deprecated
    try {
      throw new Error();
    } catch (ex) {
      const functionsMatches = ex.stack.match(
        /(\w+)@|at (Function\.)?(\w+) \(/g
      );
      const parentFunctionMatches = functionsMatches[0].match(
        /(\w+)@|at (Function\.)?(\w+) \(/
      );
      componentName = parentFunctionMatches[1] || parentFunctionMatches[3];
    }

    const { index, renderIndex } = hooksCollector.registerHook(
      componentName,
      "useEffect"
    );

    const mockedAction = jest.fn(() => {
      const unmount = action();

      if (typeof unmount === "function") {
        const mockedUnmount = jest.fn(() => unmount());
        hooksCollector.setHook({
          componentName,
          index,
          props: {
            unmountAction: mockedUnmount
          },
          renderIndex,
          type: "useEffect"
        });
        return mockedUnmount;
      }

      return unmount;
    });

    hooksCollector.setHook({
      componentName,
      index,
      props: {
        action: mockedAction,
        deps
      },
      renderIndex,
      type: "useEffect"
    });

    return origin.useEffect(mockedAction, ...deps);
  }
});
