import { invalidClassName } from "../../constants";

export const testErrorMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${invalidClassName}`).length).toBe(count);
};
