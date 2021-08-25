import { Controller, FormFields, ValidationResult } from "../../controller";

export interface InitialState {
  isDisabled: boolean;
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
  hideError?: boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  id?: string;
  name: K;
}

type RestProps<T> = Omit<
  T,
  | "controller"
  | "defaultValue"
  | "disabled"
  | "ErrorComponent"
  | "initialState"
  | "InputComponent"
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
  EComponent extends React.ElementType,
  I
> {
  ({
    controller,
    disableIf,
    ErrorComponent,
    hideError,
    hideIf,
    initialState,
    InputComponent,
    label,
    name,
    onFormChange,
    validate,
    value,
    ...rest
  }: InputPublicProps<T, K> & {
    onFormChange?: (name: K, props: typeof rest) => void;
  } & (
      | ({
          ErrorComponent: undefined;
          InputComponent: undefined;
        } & RestProps<React.InputHTMLAttributes<HTMLInputElement>>)
      | ({
          ErrorComponent: EComponent;
          InputComponent: undefined;
        } & RestProps<React.InputHTMLAttributes<HTMLInputElement>>)
      | ({
          ErrorComponent?: EComponent;
          InputComponent?: IComponent;
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
