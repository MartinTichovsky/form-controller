import { Controller } from "../controller";
import { FormFields, ValidationContentResult } from "../controller.types";

export type MessageForProps<
  T extends FormFields<T>,
  K extends keyof T
> = React.PropsWithChildren<{
  controller: Controller<T>;
  isValid?: boolean;
  name: K;
}>;

export interface MessageForState {
  isVisible: boolean;
  message: ValidationContentResult;
}
