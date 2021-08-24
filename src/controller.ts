import React from "react";

type Value = string | boolean | undefined;
export type FormFields<T> = { [K in keyof T]: Value };

type Fields<T> = {
  [K in keyof T]: {
    activeId?: string;
    isDisabled: boolean;
    isValid: boolean;
    value: Value;
  };
};

export type OnError<T> = { action: OnErrorAction; key: keyof T };
export type OnErrorAction = (showError: boolean) => void;
export type OnDisable<T> = { action: OnDisableAction; key: keyof T };
export type OnDisableAction = (disable: boolean) => void;
export type OnChangeAction = (isValid: boolean) => void;
export type OnSubmit<T extends FormFields<T>> = (
  fields: Partial<T>,
  controller: Controller<T>
) => void;
export type Validator = {
  action?: ValidatorResultAction;
  actions?: Set<ValidatorResultAction>;
  validate: ValidatorAction;
};
export type ValidatorAction = () => ValidationResult;
export type ValidatorResultAction = (
  validationResult: ValidationResult
) => void;
export type ValidationResult = false | string | null | undefined;

export class Controller<T extends FormFields<T>> {
  static uniqueIndex: number = 0;

  private _fields: Fields<T> = {} as Fields<T>;
  private _initialValues?: Partial<T>;
  private _onSubmit?: OnSubmit<T>;
  private _setController: React.Dispatch<
    React.SetStateAction<Controller<T> | undefined>
  >;
  private _validateOnChange;

  private onChangeListeners = new Set<OnChangeAction>();
  private onDisableListeners = new Set<OnDisable<T>>();
  private onDisableButtonListeners = new Set<OnDisableAction>();
  private onErrorListener = new Set<OnError<T>>();
  private validatorListeners = new Map<keyof T, Validator>();
  private keyIndex: number;

  public isSubmitted = false;

  constructor({
    initialValues,
    onSubmit,
    setController,
    validateOnChange = false
  }: {
    initialValues?: Partial<T>;
    onSubmit?: OnSubmit<T>;
    setController: React.Dispatch<
      React.SetStateAction<Controller<T> | undefined>
    >;
    validateOnChange?: boolean;
  }) {
    if (initialValues) {
      this.setInitialValues(initialValues);
      this._initialValues = initialValues;
    }
    if (onSubmit) {
      this._onSubmit = onSubmit;
    }
    this._setController = setController;
    this.keyIndex = Controller.uniqueIndex++;
    this._validateOnChange = validateOnChange;
  }

  get fields(): Partial<T> {
    const result: Partial<T> = {};

    for (let key in this._fields) {
      (result[key] as Value) = this._fields[key].value;
    }

    return result;
  }

  get isValid() {
    return Object.keys(this._fields).every(
      (key) => this._fields[key as keyof T].isValid
    );
  }

  get key() {
    return this.keyIndex;
  }

  get validateOnChange() {
    return this._validateOnChange;
  }

  private errorListeners<K extends keyof T>(key?: K) {
    for (let listener of Array.from(this.onErrorListener.values())) {
      if (listener.key in this._fields && (!key || key === listener.key)) {
        listener.action(
          !this._fields[listener.key].isValid &&
            !this._fields[listener.key].isDisabled
        );
      }
    }
  }

  private setInitialValues(initialValues: Partial<T>) {
    for (let key in initialValues) {
      this._fields[key] = {
        isDisabled: false,
        isValid: true,
        value: initialValues[key]
      };
    }
  }

  private validateAll<K extends keyof T>(key: K, silent?: boolean) {
    const validator = this.validatorListeners.get(key);
    const validationResult = validator?.validate();

    if (!silent && !this._fields[key].isDisabled) {
      validator?.actions?.forEach((action) => {
        action(validationResult);
      });
      validator?.action?.(validationResult);
    }

    return !validationResult;
  }

  public disableFields(disable: boolean) {
    this.onDisableListeners.forEach((listener) => {
      if (
        (listener.key in this._fields &&
          !this._fields[listener.key].isDisabled) ||
        !(listener.key in this._fields)
      ) {
        listener.action(disable);
      }
    });

    this.onDisableButtonListeners.forEach((listener) => {
      listener(disable);
    });
  }

  public getField<K extends keyof T>(key: K) {
    return key in this._fields ? this._fields[key] : undefined;
  }

  public getFieldValue<K extends keyof T>(key: K): T[K] | undefined {
    return key in this._fields ? (this._fields[key].value as T[K]) : undefined;
  }

  public onChange() {
    this.onChangeListeners.forEach((listener) => {
      listener(this.isValid);
    });
  }

  public resetForm() {
    this._setController(
      new Controller<T>({
        initialValues: this._initialValues,
        onSubmit: this._onSubmit,
        setController: this._setController,
        validateOnChange: this._validateOnChange
      })
    );
  }

  public setDefaultActiveId<K extends keyof T>(key: K, id?: string) {
    if (key in this._fields) {
      this._fields[key].activeId = id;
    }
  }

  public setDefaultIsDisabled<K extends keyof T>(key: K, isValid: boolean) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isDisabled: true,
        isValid
      };
    } else {
      this._fields[key] = {
        isDisabled: true,
        isValid,
        value: undefined
      };
    }
  }

  public setDefaultIsValid<K extends keyof T>(key: K, isValid: boolean) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isValid
      };
    } else {
      this._fields[key] = {
        isDisabled: false,
        isValid,
        value: undefined
      };
    }
  }

  public setFieldValue(key: keyof T, value: Value, id?: string) {
    if (key in this._fields) {
      this._fields[key] = { ...this._fields[key], activeId: id, value };
    } else {
      this._fields[key] = {
        activeId: id,
        isDisabled: false,
        isValid: true,
        value
      };
    }

    if (
      (this.isSubmitted || this.validateOnChange) &&
      !this._fields[key].isDisabled
    ) {
      this._fields[key] = {
        ...this._fields[key],
        isValid: !this.validatorListeners.has(key)
          ? true
          : this.validateAll(key)
      };
    } else if (!this._fields[key].isDisabled) {
      this._fields[key].isValid = !this.validatorListeners.has(key)
        ? true
        : this.validateAll(key, true);
    } else if (this.validateOnChange) {
      this._fields[key].isValid = !this.validatorListeners.has(key)
        ? true
        : this.validateAll(key);
    }

    this.onChange();
    this.errorListeners(key);
  }

  public setIsDisabled(key: keyof T, isDisabled: boolean, id?: string) {
    if (this._fields[key]?.isDisabled === isDisabled) {
      return;
    }

    this._fields[key] = {
      ...this._fields[key],
      isDisabled,
      value:
        (isDisabled || this._fields[key] === undefined) &&
        !this._fields[key]?.isDisabled &&
        this._fields[key]?.activeId === id &&
        (!this._initialValues ||
          !(key in this._initialValues) ||
          this._initialValues[key] !== this._fields[key]?.value)
          ? undefined
          : this._fields[key]?.value
    };

    this._fields[key].isValid = isDisabled
      ? !this.validatorListeners.has(key)
        ? true
        : this.validateAll(key, true)
      : this._fields[key].isValid !== undefined && this._fields[key].isValid;

    this.onChange();
  }

  public subscribeOnChange(action: OnChangeAction) {
    this.onChangeListeners.add(action);
  }

  public subscribeOnDisable(listener: OnDisable<T>) {
    this.onDisableListeners.add(listener);
  }

  public subscribeOnDisableButton(action: OnDisableAction) {
    this.onDisableButtonListeners.add(action);
  }

  public subscribeOnError(listener: OnError<T>) {
    this.onErrorListener.add(listener);
  }

  public subscribeValidator({
    action,
    key,
    type,
    validate
  }: {
    action: ValidatorResultAction;
    key: keyof T;
    type?: string;
    validate: ValidatorAction;
  }) {
    if (!this.validatorListeners.has(key)) {
      this.validatorListeners.set(key, {
        action: undefined,
        actions: type === "radio" ? new Set() : undefined,
        validate
      });
    }

    if (type === "radio") {
      this.validatorListeners.get(key)!.actions!.add(action);
    } else {
      this.validatorListeners.get(key)!.action = action;
    }

    if (!(key in this._fields)) {
      this._fields[key] = {
        isDisabled: false,
        isValid: false,
        value: undefined
      };
    }
  }

  public submit() {
    this.validate();
    this.isSubmitted = true;

    if (this._onSubmit && this.isValid) {
      this._onSubmit(this.fields, this);
    }

    return this;
  }

  public unsubscribeOnChange(action: OnChangeAction) {
    this.onChangeListeners.delete(action);
  }

  public unsubscribeOnDisable(listener: OnDisable<T>) {
    this.onDisableListeners.delete(listener);
  }

  public unsubscribeOnDisableButton(action: OnDisableAction) {
    this.onDisableButtonListeners.delete(action);
  }

  public unsubscribeOnError(listener: OnError<T>) {
    this.onErrorListener.delete(listener);
  }

  public unsubscribeValidator(key: keyof T, action: ValidatorResultAction) {
    if (!this.validatorListeners.has(key)) {
      return;
    }

    const validator = this.validatorListeners.get(key);

    if (validator?.actions) {
      validator.actions.delete(action);
    }

    if (
      (validator?.actions && validator?.actions.size === 0) ||
      validator?.action
    ) {
      this.validatorListeners.delete(key);
    }
  }

  public validate() {
    this.validatorListeners.forEach((validator, key) => {
      if (this._fields[key].isDisabled) {
        return;
      }

      const validationResult = validator.validate();

      this._fields[key] = {
        ...this._fields[key],
        isValid: !validationResult
      };

      if (validator.actions) {
        validator.actions.forEach((action) => {
          action(validationResult);
        });
      } else {
        validator.action?.(validationResult);
      }
    });

    this.onChange();
    this.errorListeners();
  }
}
