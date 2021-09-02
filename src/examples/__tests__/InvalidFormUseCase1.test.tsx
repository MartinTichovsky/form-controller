import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { InvalidFormUseCase1 } from "../InvalidFormUseCase1";

console.warn = jest.fn();

const resetTestId = "reset";

test("InvalidFormUseCase1", () => {
  expect(console.warn).not.toBeCalled();

  render(<InvalidFormUseCase1 />);

  expect(console.warn).toBeCalledTimes(1);

  fireEvent.click(screen.getByTestId(resetTestId));

  expect(console.warn).toBeCalledTimes(2);
});
