import { Hooks, mockReactHooks } from "./hook-mock";

describe("Hooks", () => {
  let hooks: Hooks;

  beforeEach(() => {
    hooks = new Hooks();
  });

  it("getAllHooks, getHook, setCurrent, reset", () => {
    const componentName = "someComponent";
    const current = "CurrentComponent";
    const stack = [{ useEffect: [{ deps: [1, 2, 3] }] }];

    expect(hooks.stack).toEqual({});
    expect(hooks.current).toBeUndefined();
    expect(hooks.getAllHooks(componentName)).toBeUndefined();
    expect(hooks.getHook(componentName, "useEffect")).toBeUndefined();

    hooks.stack[componentName] = stack;
    expect(hooks.getAllHooks(componentName)).toEqual(stack);
    expect(hooks.getHook(componentName, "useCallback")).toEqual([undefined]);
    expect(hooks.getHook(componentName, "useEffect")?.length).toBe(1);
    expect(hooks.getHook(componentName, "useEffect")).toEqual([
      stack[0].useEffect
    ]);

    hooks.setCurrent(current);
    expect(hooks.current).toBe(current);

    hooks.reset();
    expect(hooks.current).toBeUndefined();
    expect(hooks.stack).toEqual({});
  });

  it("registerHook", () => {
    const componentName = "someComponent";

    expect(hooks.stack).toEqual({});
    expect(hooks.current).toBeUndefined();

    let register;
    register = hooks.registerHook("useEffect");

    expect(register.current).toBeUndefined();
    expect(register.currentIndex).toBeUndefined();
    expect(register.index).toBeUndefined();

    hooks.setCurrent(componentName);

    register = hooks.registerHook("useEffect");

    expect(register.current).toBe(componentName);
    expect(register.currentIndex).toBe(0);
    expect(register.index).toBe(0);

    expect(hooks.stack).toEqual({ [componentName]: [{ useEffect: [{}] }] });

    const customName = "customName";
    hooks["_current"] = customName;
    register = hooks.registerHook("useEffect");

    expect(register.current).toBe(customName);
    expect(register.currentIndex).toBe(0);
    expect(register.index).toBe(0);
  });

  it("setHook", () => {
    const componentName = "someComponent";
    const props = { deps: [1, 2.3] };

    expect(hooks.stack).toEqual({});
    expect(hooks.current).toBeUndefined();

    hooks.setHook({
      current: undefined,
      index: 0,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual({});

    hooks.setHook({
      current: componentName,
      index: undefined,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual({});

    hooks.setHook({
      current: componentName,
      currentIndex: 1,
      index: 0,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual({});

    hooks.setHook({
      current: componentName,
      currentIndex: 0,
      index: 0,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual({});

    const stackWithComponent = { [componentName]: [{}] };

    hooks.stack = stackWithComponent;

    hooks.setHook({
      current: componentName,
      currentIndex: 0,
      index: 0,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual(stackWithComponent);

    const stackWithComponentAndType = {
      [componentName]: [{ useEffect: [{}] }]
    };

    hooks.stack = stackWithComponentAndType;

    hooks.setHook({
      current: componentName,
      currentIndex: 1,
      index: 1,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual(stackWithComponentAndType);

    hooks["_current"] = componentName;

    hooks.setHook({
      current: componentName,
      currentIndex: 0,
      index: 0,
      type: "useEffect",
      props
    });

    expect(hooks.stack).toEqual({
      [componentName]: [
        {
          useEffect: [props]
        }
      ]
    });
  });
});

describe("mockReactHooks", () => {
  it("with return action", () => {
    const componentName = "someComponent";
    const hooks = new Hooks();
    hooks.setCurrent(componentName);

    let hookAction: () => void;

    const oiginUseEffect = jest.fn((action) => {
      hookAction = () => {
        const returnAction = action();
        if (typeof returnAction === "function") {
          returnAction();
        }
      };
    });

    const origin = { someProperty: "property", useEffect: oiginUseEffect };
    const mock = mockReactHooks(origin, hooks);

    expect(mock.useEffect).not.toBeUndefined();
    expect(mock.someProperty).toBe(origin.someProperty);

    const returnAction = jest.fn();
    const action = jest.fn(() => returnAction);
    const deps = [1, 2, 3];

    mock.useEffect(action, ...deps);

    const mockedHook = hooks.getHook(componentName, "useEffect");

    expect(mockedHook).not.toBeUndefined();
    expect(mockedHook?.length).toBe(1);
    expect(oiginUseEffect).toBeCalledTimes(1);
    expect(oiginUseEffect).toBeCalledWith(mockedHook![0]![0].action, ...deps);
    expect(mockedHook![0]![0].deps).toEqual(deps);
    expect(mockedHook![0]![0].unmountAction).toBeUndefined();

    expect(mockedHook![0]![0].action).not.toBeCalled();

    hookAction!();

    expect(action).toBeCalledTimes(1);
    expect(mockedHook![0]![0].action).toBeCalledTimes(1);
    expect(returnAction).toBeCalledTimes(1);
    expect(mockedHook![0]![0].unmountAction).toBeCalledTimes(1);
  });

  it("without return action", () => {
    const hooks = new Hooks();

    const origin = {
      someProperty: "property",
      useEffect: (action: () => unknown) => {
        return action();
      }
    };
    const mock = mockReactHooks(origin, hooks);
    const action = jest.fn(() => undefined);

    expect(mock.useEffect(action, 9, 8)).toBeUndefined();
    expect(action).toBeCalledTimes(1);
  });
});
