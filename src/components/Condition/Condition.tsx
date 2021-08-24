import React from "react";
import { Controller } from "../../controller";
import { ConditionComponent } from "./ConditionComponent";
import { ConditionComponentType } from "./types";

export const Condition: ConditionComponentType = (props) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (
    props.customCondition !== undefined &&
    typeof props.customCondition !== "function"
  ) {
    throw new Error("CustomCondition is not a function");
  }

  return <ConditionComponent {...props} />;
};
