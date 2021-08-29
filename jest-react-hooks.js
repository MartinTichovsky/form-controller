// mocking react to get statistics from calling hooks
jest.mock("react", () => {
  const origin = jest.requireActual("react");
  const {
    mockReactHooks,
    ReactHooksCollector
  } = require("./src/__tests__/utils/react-hooks-collector");
  hooksCollector = new ReactHooksCollector();

  return mockReactHooks(origin, hooksCollector);
});

// mocking the component to get statistics of render count

jest.mock("./src/components/Condition/ConditionComponent", () => {
  const origin = jest.requireActual(
    "./src/components/Condition/ConditionComponent"
  );
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    ConditionComponent: mockComponent(
      origin,
      origin.ConditionComponent.name,
      hooksCollector
    )
  };
});

jest.mock("./src/components/MessageFor", () => {
  const origin = jest.requireActual("./src/components/MessageFor");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    MessageFor: mockComponent(origin, origin.MessageFor.name, hooksCollector)
  };
});

jest.mock("./src/components/FormController/FormControllerComponent", () => {
  const origin = jest.requireActual(
    "./src/components/FormController/FormControllerComponent"
  );
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    FormControllerComponent: mockComponent(
      origin,
      origin.FormControllerComponent.name,
      hooksCollector
    )
  };
});

jest.mock("./src/components/Input/InputComponent", () => {
  const origin = jest.requireActual("./src/components/Input/InputComponent");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    InputComponent: mockComponent(
      origin,
      origin.InputComponent.name,
      hooksCollector
    )
  };
});

jest.mock("./src/components/Submit/SubmitComponent", () => {
  const origin = jest.requireActual("./src/components/Submit/SubmitComponent");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    SubmitComponent: mockComponent(
      origin,
      origin.SubmitComponent.name,
      hooksCollector
    )
  };
});

jest.mock("./src/components/Validation", () => {
  const origin = jest.requireActual("./src/components/Validation");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    Validation: mockComponent(origin, origin.Validation.name, hooksCollector)
  };
});
