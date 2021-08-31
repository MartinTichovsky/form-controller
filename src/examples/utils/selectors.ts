import { invalidClassName, validClassName } from "../../constants";

export const testInvalidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${invalidClassName}`).length).toBe(count);
};

export const testValidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${validClassName}`).length).toBe(count);
};
