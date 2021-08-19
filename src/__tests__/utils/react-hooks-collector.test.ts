import { ReactHooksCollector, mockReactHooks } from "./react-hooks-collector";

const props = { deps: [1, 2.3] };
const registeredComponent = "RegisteredComponent";
const unregisteredComponent = "UnregisteredComponent";

const registeredStack = [{ useEffect: [props] }];
const registeredStackDefault = {
  [registeredComponent]: [{ useEffect: [{}] }]
};
const registeredStackWithProps = {
  [registeredComponent]: registeredStack
};
const registeredStackWithTwoRecords = {
  [registeredComponent]: [{ useEffect: [{}, {}] }]
};
const registeredStackWithTwoRecordsTwoRenders = {
  [registeredComponent]: [{ useEffect: [{}, {}] }, { useEffect: [{}] }]
};

const unregisteredStack = { useEffect: [props] };
const unregisteredStackDefault = {
  [unregisteredComponent]: { useEffect: [{}] }
};
const unregisteredStackWithProps = {
  [unregisteredComponent]: unregisteredStack
};
const unregisteredStackWithTwoRecords = {
  [unregisteredComponent]: { useEffect: [{}, {}] }
};

describe("Hooks Collector", () => {
  describe("getRegisteredComponentHooks, getRegisteredComponentHook, componentRender, reset", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Default state", () => {
      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
      expect(
        hooksCollector.getRegisteredComponentHooks(registeredComponent)
      ).toBeUndefined();
      expect(
        hooksCollector.getRegisteredComponentHook(
          registeredComponent,
          "useEffect"
        )
      ).toBeUndefined();
    });

    test("Component render should create new record in registered component", () => {
      hooksCollector.componentRender(registeredComponent);

      expect(
        hooksCollector.getRegisteredComponentHooks(registeredComponent)?.length
      ).toBe(1);
    });

    test("Get registered component hooks / hook should provide correct values", () => {
      hooksCollector.registeredComponents[registeredComponent] =
        registeredStack;

      expect(
        hooksCollector.getRegisteredComponentHooks(registeredComponent)
      ).toEqual(registeredStack);
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useCallback")
          ?.getRender(1)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRender(1)?.length
      ).toBe(1);
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRender(2)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRender(1)
      ).toEqual(registeredStack[0].useEffect);
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 1)
      ).toEqual(registeredStack[0].useEffect[0]);
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRenderHooks(2, 1)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHook(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 2)
      ).toBeUndefined();
    });

    test("reset", () => {
      hooksCollector.reset();

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });
  });

  describe("getUnregisteredComponentHooks, getUnregisteredComponentHook", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Get unregistered component hooks / hook should provide correct values", () => {
      expect(
        hooksCollector.getUnregisteredComponentHooks(unregisteredComponent)
      ).toBeUndefined;

      hooksCollector.unregisteredComponents[unregisteredComponent] =
        unregisteredStack;

      expect(
        hooksCollector.getUnregisteredComponentHooks(unregisteredComponent)
      ).toEqual(unregisteredStack);
      expect(
        hooksCollector.getUnregisteredComponentHook(
          unregisteredComponent,
          "useCallback"
        )
      ).toBeUndefined();
      expect(
        hooksCollector
          .getUnregisteredComponentHook(unregisteredComponent, "useEffect")
          ?.getHook(1)
      ).toEqual(unregisteredStack.useEffect[0]);
      expect(
        hooksCollector
          .getUnregisteredComponentHook(unregisteredComponent, "useEffect")
          ?.getHook(2)
      ).toBeUndefined();

      expect(hooksCollector.registeredComponents).toEqual({});
    });

    test("reset", () => {
      hooksCollector.reset();

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });
  });

  describe("registerHook, componentRender, getComponentRenderCount", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Register hook with not rendered component should create a record in unregistered components", () => {
      const register = hooksCollector.registerHook(
        unregisteredComponent,
        "useEffect"
      );

      expect(register.index).toBe(0);
      expect(register.renderIndex).toBeUndefined();

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackDefault
      );
    });

    test("Render component and register hook should create new record", () => {
      expect(
        hooksCollector.getComponentRenderCount(unregisteredComponent)
      ).toBe(0);

      expect(hooksCollector.getComponentRenderCount(registeredComponent)).toBe(
        0
      );

      hooksCollector.componentRender(registeredComponent);

      expect(hooksCollector.getComponentRenderCount(registeredComponent)).toBe(
        1
      );

      const register = hooksCollector.registerHook(
        registeredComponent,
        "useEffect"
      );

      expect(register.index).toBe(0);
      expect(register.renderIndex).toBe(0);

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackDefault
      );
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackDefault
      );
    });

    test("2nd register hook with registered component should create second record", () => {
      const register = hooksCollector.registerHook(
        registeredComponent,
        "useEffect"
      );

      expect(register.index).toBe(1);
      expect(register.renderIndex).toBe(0);

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackWithTwoRecords
      );
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackDefault
      );
    });

    test("2nd register hook with unregistered component should create second record", () => {
      const register = hooksCollector.registerHook(
        unregisteredComponent,
        "useEffect"
      );

      expect(register.index).toBe(1);
      expect(register.renderIndex).toBeUndefined();

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackWithTwoRecords
      );
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackWithTwoRecords
      );
    });

    test("New render should provide", () => {
      hooksCollector.componentRender(registeredComponent);
      const register = hooksCollector.registerHook(
        registeredComponent,
        "useEffect"
      );

      expect(register.index).toBe(0);
      expect(register.renderIndex).toBe(1);

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackWithTwoRecordsTwoRenders
      );
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackWithTwoRecords
      );
    });

    test("Call component render with undefined", () => {
      hooksCollector.componentRender();

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackWithTwoRecordsTwoRenders
      );
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackWithTwoRecords
      );
    });
  });

  describe("setHook - testing when registeredComponents and unregisteredComponents are empty", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("All properties must be empty object", () => {
      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("Component name is undefined, it mustn't create new entry", () => {
      hooksCollector.setHook({
        componentName: undefined,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("Index is undefined, it mustn't create new entry", () => {
      hooksCollector.setHook({
        componentName: registeredComponent,
        index: undefined,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("Render index is undefined, it mustn't create new entry", () => {
      hooksCollector.setHook({
        componentName: registeredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: undefined
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("All properties have correct values, it mustn't create new entry", () => {
      hooksCollector.setHook({
        componentName: registeredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });
  });

  describe("setHook - registeredComponents - testing when registeredComponents is set", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Set hook on registered component without hook", () => {
      const registeredComponents = { [registeredComponent]: [{}] };

      hooksCollector.registeredComponents = registeredComponents;

      hooksCollector.setHook({
        componentName: registeredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual(registeredComponents);
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("Set hook on registered component with hook and wrong index, registeredComponents mustn't change", () => {
      hooksCollector.registeredComponents = registeredStackDefault;

      hooksCollector.setHook({
        componentName: registeredComponent,
        index: 1,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackDefault
      );
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });

    test("Set hook on registered component with hook and correct index, it must pass props", () => {
      hooksCollector.setHook({
        componentName: registeredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: 0
      });

      expect(hooksCollector.registeredComponents).toEqual(
        registeredStackWithProps
      );
      expect(hooksCollector.unregisteredComponents).toEqual({});
    });
  });

  describe("setHook - unregisteredComponents - testing when unregisteredComponents is set", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Set hook on unregistered component without hook", () => {
      const unregisteredComponents = { [unregisteredComponent]: {} };

      hooksCollector.unregisteredComponents = unregisteredComponents;

      hooksCollector.setHook({
        componentName: unregisteredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: undefined
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredComponents
      );
    });

    test("Set hook on unregistered component with hook and wrong index, unregisteredComponents mustn't change", () => {
      hooksCollector.unregisteredComponents = unregisteredStackDefault;

      hooksCollector.setHook({
        componentName: unregisteredComponent,
        index: 1,
        type: "useEffect",
        props,
        renderIndex: undefined
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackDefault
      );
    });

    test("Set hook on unregistered component with hook and correct index, it must pass props", () => {
      hooksCollector.setHook({
        componentName: unregisteredComponent,
        index: 0,
        type: "useEffect",
        props,
        renderIndex: undefined
      });

      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual(
        unregisteredStackWithProps
      );
    });
  });
});

describe("Mock React Hooks", () => {
  describe("When useEffect (action) returns a function", () => {
    const componentName = "SomeComponent";

    const hooksCollector = new ReactHooksCollector();
    hooksCollector.componentRender(componentName);

    let hookAction: () => void;

    const oiginUseEffect = jest.fn((action) => {
      // for calling it manually
      hookAction = () => {
        const returnAction = action();
        if (typeof returnAction === "function") {
          returnAction();
        }
      };
    });

    const returnAction = jest.fn();
    const action = jest.fn(() => returnAction);
    const deps = [1, 2, 3];

    const reactOrigin = { someProperty: "property", useEffect: oiginUseEffect };
    const mockedReactOrigin = mockReactHooks(reactOrigin, hooksCollector);

    const registeredComponent = hooksCollector.getRegisteredComponentHook(
      componentName,
      "useEffect"
    );

    test("Mocked origin should be created and contains origin properties", () => {
      expect(mockedReactOrigin.useEffect).not.toBeUndefined();
      expect(mockedReactOrigin.someProperty).toBe(reactOrigin.someProperty);
    });

    test("Before calling useEffect, hooks collector mustn't contain hooks", () => {
      expect(
        hooksCollector
          .getRegisteredComponentHook(componentName, "useEffect")
          ?.getRender(1)
      ).toBeUndefined();
      expect(hooksCollector.getRegisteredComponentHooks(componentName)).toEqual(
        [{}]
      );
    });

    test("When useEfect is called, it must record an action and deps", () => {
      // mock a call from a component, must have same name as string in `componentName` property
      function SomeComponent() {
        mockedReactOrigin.useEffect(action, ...deps);
      }

      SomeComponent();

      // first render mustn't call the action, but component must be registered
      expect(registeredComponent).not.toBeUndefined();
      expect(registeredComponent?.getRender(1)?.length).toBe(1);
      expect(oiginUseEffect).toBeCalledTimes(1);
      expect(oiginUseEffect).toBeCalledWith(
        registeredComponent?.getRenderHooks(1, 1)?.action,
        ...deps
      );
      expect(registeredComponent?.getRenderHooks(1, 1)?.deps).toEqual(deps);
      expect(
        registeredComponent?.getRenderHooks(1, 1)?.unmountAction
      ).toBeUndefined();

      expect(
        registeredComponent?.getRenderHooks(1, 1)?.action
      ).not.toBeCalled();
    });

    test("Calling the hook action should call the return action", () => {
      hookAction!();

      expect(action).toBeCalledTimes(1);
      expect(registeredComponent?.getRenderHooks(1, 1)?.action).toBeCalledTimes(
        1
      );
      expect(returnAction).toBeCalledTimes(1);
      expect(
        registeredComponent?.getRenderHooks(1, 1)?.unmountAction
      ).toBeCalledTimes(1);
    });
  });

  test("The useEffect (action) doesn't return a function", () => {
    const hooksCollector = new ReactHooksCollector();

    const origin = {
      someProperty: "property",
      useEffect: (action: () => unknown) => {
        return action();
      }
    };

    const mock = mockReactHooks(origin, hooksCollector);
    const action = jest.fn(() => undefined);

    expect(mock.useEffect(action, 9, 8)).toBeUndefined();
    expect(action).toBeCalledTimes(1);
  });
});
