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

jest.mock("./src/components/Field/Field", () => {
  const origin = jest.requireActual("./src/components/Field/Field");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    Field: mockComponent(origin, origin.Field.name, hooksCollector)
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

jest.mock("./src/components/MessageFor", () => {
  const origin = jest.requireActual("./src/components/MessageFor");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    MessageFor: mockComponent(origin, origin.MessageFor.name, hooksCollector)
  };
});

jest.mock("./src/components/Select", () => {
  const origin = jest.requireActual("./src/components/Select");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    Select: mockComponent(origin, origin.Select.name, hooksCollector)
  };
});

jest.mock("./src/components/SelectOption", () => {
  const origin = jest.requireActual("./src/components/SelectOption");
  const { mockComponent } = require("./src/__tests__/utils/clone-function");

  return {
    ...origin,
    SelectOption: mockComponent(
      origin,
      origin.SelectOption.name,
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
