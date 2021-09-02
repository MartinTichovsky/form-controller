import {
  invalidMessageClassName,
  validMessageClassName
} from "../../constants";

export const testInvalidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${invalidMessageClassName}`).length).toBe(
    count
  );
};

export const testValidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${validMessageClassName}`).length).toBe(
    count
  );
};
