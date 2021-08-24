import { errorClassName } from "../../constants";

export const testErrorMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${errorClassName}`).length).toBe(count);
};
