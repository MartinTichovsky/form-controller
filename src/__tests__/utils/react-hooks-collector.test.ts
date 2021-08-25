import { mockReactHooks, ReactHooksCollector } from "./react-hooks-collector";

const props = { deps: [1, 2.3] };
const registeredComponent = "RegisteredComponent";
const unregisteredComponent = "UnregisteredComponent";

const registeredStack = [{ hooks: { useEffect: [props] } }];
const registeredStackDefault = {
  [registeredComponent]: [{ hooks: { useEffect: [{}] } }]
};
const registeredStackWithProps = {
  [registeredComponent]: registeredStack
};
const registeredStackWithTwoRecords = {
  [registeredComponent]: [{ hooks: { useEffect: [{}, {}] } }]
};
const registeredStackWithTwoRecordsTwoRenders = {
  [registeredComponent]: [
    { hooks: { useEffect: [{}, {}] } },
    { hooks: { useEffect: [{}] } }
  ]
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
  describe("getRegisteredComponentRenders, getRegisteredComponentHooks, componentRender, reset", () => {
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    test("Default state", () => {
      expect(hooksCollector.registeredComponents).toEqual({});
      expect(hooksCollector.unregisteredComponents).toEqual({});
      expect(
        hooksCollector.getRegisteredComponentRenders(registeredComponent)
      ).toBeUndefined();
      expect(
        hooksCollector.getRegisteredComponentRenders(
          registeredComponent,
          "fake-id"
        )
      ).toBeUndefined();
      expect(
        hooksCollector.getRegisteredComponentHooks(
          registeredComponent,
          "useEffect"
        )
      ).toBeUndefined();
    });

    test("Component render should create new record in registered component", () => {
      hooksCollector.componentRender(registeredComponent);

      expect(
        hooksCollector.getRegisteredComponentRenders(registeredComponent)
          ?.length
      ).toBe(1);
    });

    test("Get registered component hooks / hook should provide correct values", () => {
      hooksCollector.registeredComponents[registeredComponent] =
        registeredStack;

      expect(
        hooksCollector.getRegisteredComponentRenders(registeredComponent)
      ).toEqual(registeredStack.map((render) => render.hooks));
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRender(1)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(1)?.length
      ).toBe(1);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(2)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(1)
      ).toEqual(registeredStack[0].hooks.useEffect);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 1)
      ).toEqual(registeredStack[0].hooks.useEffect[0]);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(2, 1)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 2)
      ).toBeUndefined();
    });

    test("getRegisteredComponentHooks", () => {
      const registeredStack = {
        [registeredComponent]: [
          {
            hooks: { useEffect: [{ deps: [5, 9] }, { deps: [3, 2] }] }
          },
          { hooks: { useEffect: [{ deps: [9, 5] }] } },

          { hooks: { useCallback: [{ deps: [7] }] } }
        ]
      };
      hooksCollector.registeredComponents = registeredStack;

      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(1)
      ).toEqual(registeredStack[registeredComponent][0].hooks.useEffect);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(2)
      ).toEqual(registeredStack[registeredComponent][1].hooks.useEffect);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRender(3)
      ).toBeUndefined();

      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRender(1)
      ).toBeUndefined();
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRender(3)
      ).toEqual(registeredStack[registeredComponent][2].hooks.useCallback);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRender(2)
      ).toEqual(registeredStack[registeredComponent][1].hooks.useCallback);

      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 1)
      ).toEqual(registeredStack[registeredComponent][0].hooks.useEffect![0]);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 2)
      ).toEqual(registeredStack[registeredComponent][0].hooks.useEffect![1]);
      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useEffect")
          ?.getRenderHooks(1, 3)
      ).toBeUndefined();

      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRenderHooks(2, 1)
      ).toEqual(registeredStack[registeredComponent][1].hooks.useCallback?.[0]);

      expect(
        hooksCollector
          .getRegisteredComponentHooks(registeredComponent, "useCallback")
          ?.getRenderHooks(2, 2)
      ).toBeUndefined();

      expect(
        hooksCollector.getRegisteredComponentRenders(registeredComponent)
      ).toEqual(
        registeredStack[registeredComponent].map((render) => render.hooks)
      );
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
        hooksCollector.getUnregisteredComponentRenders(unregisteredComponent)
      ).toBeUndefined;

      hooksCollector.unregisteredComponents[unregisteredComponent] =
        unregisteredStack;

      expect(
        hooksCollector.getUnregisteredComponentRenders(unregisteredComponent)
      ).toEqual(unregisteredStack);
      expect(
        hooksCollector.getUnregisteredComponentHooks(
          unregisteredComponent,
          "useCallback"
        )
      ).toBeUndefined();
      expect(
        hooksCollector
          .getUnregisteredComponentHooks(unregisteredComponent, "useEffect")
          ?.getHook(1)
      ).toEqual(unregisteredStack.useEffect[0]);
      expect(
        hooksCollector
          .getUnregisteredComponentHooks(unregisteredComponent, "useEffect")
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
      // register useEffect
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

      const useEffectHooks = hooksCollector.getUnregisteredComponentHooks(
        unregisteredComponent,
        "useEffect"
      );

      expect(useEffectHooks?.getHook(1)).toEqual({});
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

      // register useEffect
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

      const useEffectHooks = hooksCollector.getRegisteredComponentHooks(
        registeredComponent,
        "useEffect"
      );

      expect(useEffectHooks?.getRenderHooks(1, 1)).toEqual({});
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

    test("Register more effects", () => {
      let register;

      // register useCallback
      register = hooksCollector.registerHook(
        registeredComponent,
        "useCallback"
      );

      expect(register.index).toBe(0);
      expect(register.renderIndex).toBe(1);

      const useCallbackHooksRegistered =
        hooksCollector.getRegisteredComponentHooks(
          registeredComponent,
          "useCallback"
        );

      expect(useCallbackHooksRegistered?.getRenderHooks(2, 1)).toEqual({});

      // register useCallback
      register = hooksCollector.registerHook(
        unregisteredComponent,
        "useCallback"
      );

      expect(register.index).toBe(0);
      expect(register.renderIndex).toBeUndefined();

      const useCallbackHooksUnregistered =
        hooksCollector.getUnregisteredComponentHooks(
          unregisteredComponent,
          "useCallback"
        );

      expect(useCallbackHooksUnregistered?.getHook(1)).toEqual({});
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
      const registeredComponents = { [registeredComponent]: [{ hooks: {} }] };

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

  test("Complete workflow", () => {
    const testId = "test-id";
    const props1 = { action: jest.fn() };
    const props2 = { unmountAction: jest.fn() };
    const hooksCollector: ReactHooksCollector = new ReactHooksCollector();

    hooksCollector.componentRender(registeredComponent, testId);

    expect(hooksCollector["activeDataTestId"]).toBe(testId);

    expect(
      hooksCollector.getComponentRenderCount(registeredComponent, testId)
    ).toBe(1);

    let register;

    register = hooksCollector.registerHook(registeredComponent, "useEffect");

    hooksCollector.setHook({
      componentName: registeredComponent,
      index: register.index,
      renderIndex: register.renderIndex,
      type: "useEffect",
      props: props1
    });

    expect(
      hooksCollector.getRegisteredComponentRenders(registeredComponent, testId)
    ).toEqual([
      {
        useEffect: [props1]
      }
    ]);
    expect(
      hooksCollector.getRegisteredComponentRenders(
        registeredComponent,
        "fake-id"
      )
    ).toEqual([]);

    // first render, first register
    const componentHook = hooksCollector.getRegisteredComponentHooks(
      registeredComponent,
      "useEffect",
      testId
    );

    expect(componentHook?.getRender(1)).toEqual([props1]);
    expect(componentHook?.getRender(2)).toBeUndefined();
    expect(componentHook?.getRenderHooks(1, 1)).toEqual(props1);
    expect(componentHook?.getRenderHooks(1, 2)).toBeUndefined();
    expect(componentHook?.getRenderHooks(2, 1)).toBeUndefined();

    expect(
      hooksCollector.getRegisteredComponentHooks(
        registeredComponent,
        "useEffect",
        "fake-id"
      )
    ).toBeUndefined();

    // first render, second register
    register = hooksCollector.registerHook(registeredComponent, "useEffect");

    hooksCollector.setHook({
      componentName: registeredComponent,
      index: register.index,
      renderIndex: register.renderIndex,
      type: "useEffect",
      props: props2
    });

    expect(componentHook?.getRender(1)).toEqual([props1, props2]);
    expect(componentHook?.getRenderHooks(1, 2)).toEqual(props2);

    hooksCollector.componentRender(registeredComponent, testId);

    expect(
      hooksCollector.getComponentRenderCount(registeredComponent, testId)
    ).toBe(2);

    // second render, first register
    register = hooksCollector.registerHook(registeredComponent, "useEffect");

    hooksCollector.setHook({
      componentName: registeredComponent,
      index: register.index,
      renderIndex: register.renderIndex,
      type: "useEffect",
      props: props2
    });

    expect(componentHook?.getRender(2)).toEqual([props2]);
    expect(componentHook?.getRenderHooks(2, 1)).toEqual(props2);
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

    const registeredComponent = hooksCollector.getRegisteredComponentHooks(
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
          .getRegisteredComponentHooks(componentName, "useEffect")
          ?.getRender(1)
      ).toBeUndefined();
      expect(
        hooksCollector.getRegisteredComponentRenders(componentName)
      ).toEqual([{}]);
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
