import React from "react";

export type FormFields<T> = { [K in keyof T]: string | boolean };

type Fields<T> = {
  [K in keyof T]: {
    isDisabled: boolean;
    isValid: boolean;
    value: T[K] | undefined;
  };
};

export type OnDisableAction = (disable: boolean) => void;
export type OnChangeAction = (isValid: boolean) => void;
export type OnSubmit<T> = (
  fields: Partial<T>,
  controller: Controller<T>
) => void;
export type ValidatorAction = (silent?: boolean) => boolean;

export class Controller<T> {
  static uniqueIndex: number = 0;

  private _fields: Fields<T> = {} as Fields<T>;
  private _initialValues?: T;
  private _onSubmit?: OnSubmit<T>;
  private _setController: React.Dispatch<
    React.SetStateAction<Controller<T> | undefined>
  >;
  private _validateOnChange;

  private onChangeListeners = new Set<OnChangeAction>();
  private onDisableListeners = new Map<keyof T, OnDisableAction>();
  private onDisableButtonListeners = new Set<OnDisableAction>();
  private validatorListeners = new Map<keyof T, ValidatorAction>();
  private keyIndex: number;

  public isSubmitted = false;

  constructor({
    initialValues,
    onSubmit,
    setController,
    validateOnChange = false
  }: {
    initialValues?: T;
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
      result[key] = this._fields[key].value;
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

  private setInitialValues(initialValues: T) {
    for (let key in initialValues) {
      this._fields[key].value = initialValues[key];
    }
  }

  // private deepClone = <T extends Object>(subject: T): T => {
  //   if (typeof subject !== "object" || subject === null) {
  //     return subject;
  //   }

  //   const result: T = (
  //     Array.isArray(subject) ? [...subject] : { ...subject }
  //   ) as T;

  //   for (let key in result) {
  //     if (typeof result[key] === "object") {
  //       result[key] = this.deepClone(result[key]);
  //     }
  //   }

  //   return result;
  // };

  // private isObject = (subject: unknown) => typeof subject === "object" && !Array.isArray(subject) && subject !== null;

  public disableFields(disable: boolean) {
    this.onDisableListeners.forEach((listener, key) => {
      if (
        (key in this._fields && !this._fields[key].isDisabled) ||
        !(key in this._fields)
      ) {
        listener(disable);
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
    return key in this._fields ? this._fields[key].value : undefined;
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

  public setFieldValue<K extends keyof T>(key: K, value: T[K]) {
    if (key in this._fields) {
      this._fields[key].value = value;
    } else {
      this._fields[key] = { isDisabled: false, isValid: true, value };
    }

    if (
      (this.isSubmitted || this.validateOnChange) &&
      !this._fields[key].isDisabled
    ) {
      this._fields[key] = {
        ...this._fields[key],
        isValid: this.validatorListeners.get(key)?.()
      };
    } else if (!this._fields[key].isDisabled) {
      this._fields[key].isValid =
        this.validatorListeners.get(key)?.(true) === true;
    }

    this.onChange();
  }

  public setIsDisabled<K extends keyof T>(key: K, isDisabled: boolean) {
    this._fields[key] = {
      ...this._fields[key],
      isDisabled,
      value: isDisabled ? undefined : this._fields[key]?.value
    };
    this._fields[key].isValid = isDisabled
      ? this.validatorListeners.get(key)?.(true) === true
      : this._fields[key]?.isValid === true;
  }

  public subscribeOnChange(action: OnChangeAction) {
    this.onChangeListeners.add(action);
  }

  public subscribeOnDisable<K extends keyof T>(
    key: K,
    action: OnDisableAction
  ) {
    this.onDisableListeners.set(key, action);
  }

  public subscribeOnDisableButton(action: OnDisableAction) {
    this.onDisableButtonListeners.add(action);
  }

  public subscribeValidator<K extends keyof T>(
    key: K,
    action: ValidatorAction
  ) {
    this.validatorListeners.set(key, action);
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

  public unsubscribeOnDisable<K extends keyof T>(key: K) {
    this.onDisableListeners.delete(key);
  }

  public unsubscribeOnDisableButton(action: OnDisableAction) {
    this.onDisableButtonListeners.delete(action);
  }

  public unsubscribeValidator<K extends keyof T>(key: K) {
    this.validatorListeners.delete(key);
  }

  public validate() {
    this.validatorListeners.forEach((validate, key) => {
      this._fields[key] = {
        ...this._fields[key],
        isValid: validate()
      };
    });

    this.onChange();
  }
}
