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
    [key: string]: { dataTestId?: string; hooks: ComponentHooks }[];
  } = {};

  unregisteredComponents: {
    [key: string]: ComponentHooks;
  } = {};

  private activeDataTestId?: string;

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

  getRegisteredComponentRenders(componentName: string, dataTestId?: string) {
    if (!(componentName in this.registeredComponents)) {
      return undefined;
    }

    return this.registeredComponents[componentName]
      .filter((render) => render.dataTestId === dataTestId)
      ?.map((render) => render.hooks);
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

  registerHook(componentName: string, type: HookType) {
    if (!(componentName in this.registeredComponents)) {
      return this.createUregisteredComponent(componentName, type);
    }

    const renders = this.registeredComponents[componentName].filter(
      (render) => render.dataTestId === this.activeDataTestId
    );

    if (!(type in renders[renders.length - 1].hooks)) {
      renders[renders.length - 1].hooks[type] = [];
    }

    renders[renders.length - 1].hooks[type]!.push({});

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

    const renders = this.registeredComponents[componentName]?.filter(
      (render) => render.dataTestId === this.activeDataTestId
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
