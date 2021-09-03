type HookCallbackType = "useCallback";

type HookEffectType = "useEffect";

type HoookReducerType = "useReducer";

type HookResultType = "useContext" | "useRef" | "useMemo";

type HookStateType = "useState";

type HookType =
  | HookCallbackType
  | HookEffectType
  | HoookReducerType
  | HookResultType
  | HookStateType;

interface HookCallback {
  action?: jest.Mock;
  deps?: any[];
}

interface HookEffect {
  action?: jest.Mock;
  deps?: any[];
  unmountAction?: jest.Mock;
}

interface HookResult {
  args?: any;
  result?: any;
}

interface HookState {
  mockedSetState?: jest.Mock;
  setState?: Function;
  state?: any;
}

type ComponentHooks = {
  [key in HookCallbackType]?: HookCallback[];
} &
  {
    [key in HookEffectType]?: HookEffect[];
  } &
  {
    [key in HookResultType]?: HookResult[];
  } &
  {
    [key in HookStateType]?: HookState[];
  };

declare global {
  var hooksCollector: ReactHooksCollector;
}

export class ReactHooksCollector {
  registeredComponents: {
    [key: string]: { dataTestId?: string; hooks: ComponentHooks }[];
  } = {};

  unregisteredComponents: {
    [key: string]: ComponentHooks;
  } = {};

  public activeDataTestId?: string;

  private createUnregisteredComponent(
    componentName: string,
    type: HookType,
    props?: HookCallback | HookEffect | HookResult | HookState
  ) {
    if (!(componentName in this.unregisteredComponents)) {
      this.unregisteredComponents[componentName] = {};
    }

    if (!(type in this.unregisteredComponents[componentName])) {
      this.unregisteredComponents[componentName][type] = [];
    }

    this.unregisteredComponents[componentName][type]!.push(props || {});

    return {
      index: this.unregisteredComponents[componentName][type]!.length - 1,
      renderIndex: undefined
    };
  }

  componentRender(componentName?: string, dataTestId?: string) {
    if (componentName === undefined) {
      return;
    }

    this.activeDataTestId = dataTestId;

    if (!(componentName in this.registeredComponents)) {
      this.registeredComponents[componentName] = [];
    }

    this.registeredComponents[componentName].push({ dataTestId, hooks: {} });
  }

  componentUnmount() {
    this.activeDataTestId = undefined;
  }

  getComponentRenderCount(componentName: string, dataTestId?: string) {
    return (
      this.registeredComponents[componentName]?.filter(
        (render) => render.dataTestId === dataTestId
      )?.length || 0
    );
  }

  getExistingSetStateMockedAction(
    componentName: string,
    type: HookStateType,
    setState: Function
  ) {
    const renders = this.registeredComponents[componentName]?.filter(
      (render) => render.dataTestId === this.activeDataTestId
    );

    if (!renders) {
      return;
    }

    for (let render of renders) {
      if (!render?.hooks?.[type]) {
        continue;
      }

      const existingItem = render.hooks[type]?.find(
        (item) => item.setState === setState
      );

      if (existingItem) {
        return existingItem.mockedSetState;
      }
    }
  }

  getRegisteredComponentRenders(componentName: string, dataTestId?: string) {
    if (!(componentName in this.registeredComponents)) {
      return undefined;
    }

    return this.registeredComponents[componentName]
      .filter((render) => render.dataTestId === dataTestId)
      .map((render) => render.hooks);
  }

  getRegisteredComponentHooks(
    componentName: string,
    type: HookType,
    dataTestId?: string
  ) {
    if (
      !(componentName in this.registeredComponents) ||
      !this.registeredComponents[componentName].filter(
        (render) => render.dataTestId === dataTestId
      ).length
    ) {
      return undefined;
    }

    return {
      getRender: (renderNumber: number) => {
        const renders = this.registeredComponents[componentName].filter(
          (render) => render.dataTestId === dataTestId
        );

        return !renders.length || renderNumber > renders.length
          ? undefined
          : renders[renderNumber - 1].hooks[type];
      },
      getRenderHooks: (renderNumber: number, hookNumber: number) => {
        const renders = this.registeredComponents[componentName].filter(
          (render) => render.dataTestId === dataTestId
        );

        return !renders.length || renderNumber > renders.length
          ? undefined
          : !renders[renderNumber - 1].hooks[type] ||
            !renders[renderNumber - 1].hooks[type]!.length ||
            hookNumber > renders[renderNumber - 1].hooks[type]!.length
          ? undefined
          : renders[renderNumber - 1].hooks[type]![hookNumber - 1];
      }
    };
  }

  getUnregisteredComponentRenders(componentName: string) {
    if (!(componentName in this.unregisteredComponents)) {
      return undefined;
    }

    return this.unregisteredComponents[componentName];
  }

  getUnregisteredComponentHooks(componentName: string, type: HookType) {
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

  registerHook(
    componentName: string,
    type: HookType,
    props?: HookState | HookEffect
  ) {
    if (!(componentName in this.registeredComponents)) {
      return this.createUnregisteredComponent(componentName, type, props);
    }

    const renders = this.registeredComponents[componentName].filter(
      (render) => render.dataTestId === this.activeDataTestId
    );

    if (!(type in renders[renders.length - 1].hooks)) {
      renders[renders.length - 1].hooks[type] = [];
    }

    renders[renders.length - 1].hooks[type]!.push(props || {});

    return {
      index: renders[renders.length - 1].hooks[type]!.length - 1,
      renderIndex: renders.length - 1
    };
  }

  reset() {
    this.registeredComponents = {};
    this.unregisteredComponents = {};
  }

  setHook({
    componentName,
    dataTestId,
    index,
    props,
    renderIndex,
    type
  }: {
    componentName: string | undefined;
    dataTestId?: string;
    index: number | undefined;
    props: HookEffect | HookState;
    renderIndex: number | undefined;
    type: HookEffectType;
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

    const renders = this.registeredComponents[componentName]?.filter(
      (render) => render.dataTestId === dataTestId
    );

    // check registered integrity
    if (
      !(componentName in this.registeredComponents) ||
      !renders ||
      !renders.length ||
      renders.length <= renderIndex ||
      !(type in renders[renderIndex].hooks) ||
      !renders[renderIndex].hooks[type]!.length ||
      renders[renderIndex].hooks[type]!.length <= index
    ) {
      return;
    }

    renders[renderIndex].hooks[type]![index] = {
      ...renders[renderIndex].hooks[type]![index],
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
    } catch (ex: any) {
      const functionsMatches = ex.stack.match(
        /(\w+)@|at (Function\.)?(\w+) \(/g
      );
      const parentFunctionMatches = functionsMatches[0].match(
        /(\w+)@|at (Function\.)?(\w+) \(/
      );
      componentName = parentFunctionMatches[1] || parentFunctionMatches[3];
    }

    const mockedAction = jest.fn((...props) => action(...props));

    hooksCollector.registerHook(componentName, "useCallback", {
      action: mockedAction,
      deps
    });

    return origin.useCallback(mockedAction, ...deps);
  },
  useEffect: function useEffect(action: () => () => void, ...deps: any[]) {
    let componentName: string;

    // get caller function name from error stack since Funcion.caller is deprecated
    try {
      throw new Error();
    } catch (ex: any) {
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

    const dataTestId = hooksCollector.activeDataTestId;

    const mockedAction = jest.fn(() => {
      const unmount = action();

      if (typeof unmount === "function") {
        const mockedUnmount = jest.fn(() => unmount());
        hooksCollector.setHook({
          componentName,
          dataTestId,
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
      dataTestId,
      index,
      props: {
        action: mockedAction,
        deps
      },
      renderIndex,
      type: "useEffect"
    });

    return origin.useEffect(mockedAction, ...deps);
  },
  useState: function useState(initialValue: unknown) {
    const result = origin.useState(initialValue);

    let componentName: string;

    // get caller function name from error stack since Funcion.caller is deprecated
    try {
      throw new Error();
    } catch (ex: any) {
      const functionsMatches = ex.stack.match(
        /(\w+)@|at (Function\.)?(\w+) \(/g
      );
      const parentFunctionMatches = functionsMatches[0].match(
        /(\w+)@|at (Function\.)?(\w+) \(/
      );
      componentName = parentFunctionMatches[1] || parentFunctionMatches[3];
    }

    const existingMockedSetState =
      hooksCollector.getExistingSetStateMockedAction(
        componentName,
        "useState",
        result[1]
      );

    if (existingMockedSetState) {
      hooksCollector.registerHook(componentName, "useState", {
        state: result[0]
      });

      return [result[0], existingMockedSetState];
    }

    const mockedSetState = jest.fn((...props) => {
      return result[1](...props);
    });

    Object.defineProperties(
      mockedSetState,
      Object.getOwnPropertyDescriptors(result[1])
    );

    hooksCollector.registerHook(componentName, "useState", {
      mockedSetState,
      setState: result[1],
      state: result[0]
    });

    return [result[0], mockedSetState];
  }
});
