import { Controller, FormFields, ValidationResult } from "../../controller";

export interface InitialState {
  isDisabled: boolean;
  isValid?: boolean;
  isVisible: boolean;
}

export interface InputPrivateProps {
  defaultValue: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface InputPublicProps<T extends FormFields<T>, K extends keyof T> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  hideMessage?: boolean;
  id?: string;
  name: K;
}

type RestProps<T> = Omit<
  T,
  | "controller"
  | "defaultValue"
  | "disabled"
  | "disableIf"
  | "hideIf"
  | "hideMessage"
  | "initialState"
  | "InputComponent"
  | "MessageComponent"
  | "name"
  | "onChange"
  | "onKeyDown"
  | "type"
  | "validate"
>;

export interface InputComponentType<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & InputPrivateProps
  >,
  MComponent extends React.ElementType,
  I
> {
  ({
    controller,
    disableIf,
    hideMessage: hideError,
    hideIf,
    initialState,
    InputComponent,
    label,
    MessageComponent,
    name,
    onFormChange,
    validate,
    value,
    ...rest
  }: InputPublicProps<T, K> & {
    onFormChange?: (name: K, props: typeof rest) => void;
  } & (
      | ({
          InputComponent: undefined;
          MessageComponent: undefined;
        } & RestProps<React.InputHTMLAttributes<HTMLInputElement>>)
      | ({
          InputComponent: undefined;
          MessageComponent: MComponent;
        } & RestProps<React.InputHTMLAttributes<HTMLInputElement>>)
      | ({
          InputComponent?: IComponent;
          MessageComponent?: MComponent;
        } & RestProps<React.ComponentPropsWithoutRef<IComponent>>)
    ) &
    (
      | {
          type?: undefined | "text" | "email" | "number";
          label?: string | JSX.Element;
          placeholder?: string;
          validate?: (
            value: T[K] | undefined,
            props: typeof rest
          ) => ValidationResult;
          value?: undefined;
        }
      | {
          label: string | JSX.Element;
          placeholder?: undefined;
          type: "radio";
          validate?: undefined;
          value: string;
        }
    ) & {
      initialState?: I;
    }): JSX.Element | null;
}
