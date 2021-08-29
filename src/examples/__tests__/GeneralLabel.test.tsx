import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { GeneralLabel } from "../GeneralLabel";

console.log = jest.fn();

const input1TestId = "input-1";
const input2TestId = "input-2";
const input3TestId = "input-3";
const resetTestId = "reset";
const submitTestId = "submit";

test("GeneralLabel", async () => {
  const { container } = render(<GeneralLabel />);

  // three labels must exist
  const labels = container.querySelectorAll("label");
  expect(labels.length).toBe(3);

  // click on the first label
  userEvent.click(screen.getByText("Salutation"));
  expect(screen.getByTestId(input1TestId)).toHaveFocus();

  // click on the second label
  userEvent.click(screen.getByText("Given name"));
  expect(screen.getByTestId(input2TestId)).toHaveFocus();

  // click on the third label
  userEvent.click(screen.getByText("Surname"));
  expect(screen.getByTestId(input3TestId)).toHaveFocus();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  fireEvent.click(screen.getByTestId(resetTestId));
});
