import React from "react";
import { wait } from "./utils/utils";

type Action = () => void;
type Fields<T> = {
  [K in keyof T]: {
    activeId?: string;
    isDisabled: boolean;
    isValid: boolean;
    isValidated: boolean;
    isVisible: boolean;
    options?: Map<
      string,
      {
        isDisabled: boolean;
        isVisible: boolean;
      }
    >;
    validationInProgress: boolean;
    validationResult: ValidationContentResult;
    value: Value;
  };
};
type Value = string | boolean | undefined;

export type FormFields<T> = { [K in keyof T]: Value };
export type OnDisable<T> = { action: OnDisableAction; key: keyof T };
export type OnDisableAction = (disable: boolean) => void;
export type OnChangeAction = (isValid: boolean) => void;
export type OnSubmit<T extends FormFields<T>> = (
  fields: Partial<T>,
  controller: Controller<T>
) => void;
export type OnValidate<T> = {
  action: OnValidateAction;
  key: keyof T;
};
export type OnValidateAction = (show: boolean, fieldIsValid: boolean) => void;
export type Validator = {
  action?: ValidatorResultAction;
  actions?: Set<ValidatorResultAction>;
  validate: ValidatorAction;
};
export type ValidatorAction = () => ValidationResult;
export type ValidatorResultAction = (
  validationResult: ValidationResult
) => void;
export type ValidationResult =
  | ValidationContentResult
  | {
      isValid: boolean;
      content?: string | JSX.Element;
    }
  | {
      content: string | JSX.Element;
      promise: () => Promise<{
        isValid: boolean;
        content?: string | JSX.Element;
      }>;
    };
export type ValidationContentResult =
  | boolean
  | string
  | null
  | undefined
  | JSX.Element;

export class Controller<T extends FormFields<T>> {
  static uniqueIndex: number = 0;

  private _afterAll: {
    disable: Map<keyof T, Action>;
    validate: Action[];
    visible: Map<keyof T, Action>;
  } = { disable: new Map(), validate: [], visible: new Map() };
  private _onChangeCounter = 0;
  private _defaultActiveId: { [key in keyof T]?: string } = {};
  private _disableIf?: { [key in keyof T]?: (fields: Partial<T>) => boolean };
  private _fields: Fields<T> = {} as Fields<T>;
  private _hideIf?: { [key in keyof T]?: (fields: Partial<T>) => boolean };
  private _initialValues?: Partial<T>;
  private _isSubmitted = false;
  private _onSubmit?: OnSubmit<T>;
  private _setController: React.Dispatch<
    React.SetStateAction<Controller<T> | undefined>
  >;
  private _validateOnChange;
  private _validation?:
    | {
        [key in keyof T]?: (
          value: T[key] | undefined,
          props: unknown
        ) => ValidationResult;
      };
  private _validationPromiseCounter: { [key in keyof T]?: number } = {};

  private isSelectedListeners = new Map<string, Action>();
  private keyIndex: number;
  private onChangeListeners = new Set<OnChangeAction>();
  private onDisableListeners = new Set<OnDisable<T>>();
  private onDisableButtonListeners = new Set<OnDisableAction>();
  private onValidateListener = new Set<OnValidate<T>>();
  private registeredKeys: { key: keyof T; type: string }[] = [];
  private validatorListeners = new Map<keyof T, Validator>();

  constructor({
    disableIf,
    hideIf,
    initialValues,
    onSubmit,
    setController,
    validateOnChange = false,
    validation
  }: {
    disableIf?: {
      [key in keyof T]?: (fields: Partial<T>) => boolean;
    };
    hideIf?: {
      [key in keyof T]?: (fields: Partial<T>) => boolean;
    };
    initialValues?: Partial<T>;
    onSubmit?: OnSubmit<T>;
    setController: React.Dispatch<
      React.SetStateAction<Controller<T> | undefined>
    >;
    validateOnChange?: boolean;
    validation?:
      | {
          [key in keyof T]?: (
            value: T[key] | undefined,
            props: unknown
          ) => ValidationResult;
        };
  }) {
    if (initialValues) {
      this.setInitialValues(initialValues);
      this._initialValues = initialValues;
    }
    if (onSubmit) {
      this._onSubmit = onSubmit;
    }

    this._disableIf = disableIf;
    this._hideIf = hideIf;
    this.keyIndex = Controller.uniqueIndex++;
    this._setController = setController;
    this._validation = validation;
    this._validateOnChange = validateOnChange;
  }

  get fields(): Partial<T> {
    const result: Partial<T> = {};

    for (let key in this._fields) {
      (result[key] as Value) = this._fields[key].value;
    }

    return result;
  }

  get isSubmitted() {
    return this._isSubmitted;
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

  private afterAll() {
    if (this._onChangeCounter === 0) {
      Object.values(this._afterAll).forEach((stack) => {
        stack.forEach((action) => {
          action();
        });
      });
      this._afterAll = {
        disable: new Map(),
        validate: [],
        visible: new Map()
      };
    }
  }

  public deleteField(key: keyof T, id?: string) {
    if (!(key in this._fields)) {
      return;
    }

    if (id && this._fields[key].options?.has(id)) {
      this._fields[key].options?.delete(id);
    }

    if (this._fields[key].activeId === id) {
      this._fields[key].activeId = undefined;
    }

    if (!this._fields[key].options?.size) {
      delete this._fields[key];
    }
  }

  private disableButtons(disable: boolean) {
    this.onDisableButtonListeners.forEach((listener) => {
      listener(disable);
    });
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

    this.disableButtons(disable);
  }

  public getDisableCondition(key: keyof T) {
    return this._disableIf && key in this._disableIf
      ? this._disableIf[key]
      : undefined;
  }

  public getField(key: keyof T) {
    return key in this._fields ? this._fields[key] : undefined;
  }

  public getFieldValue<K extends keyof T>(key: K): T[K] | undefined {
    return key in this._fields ? (this._fields[key].value as T[K]) : undefined;
  }

  public getHideCondition(key: keyof T) {
    return this._hideIf && key in this._hideIf ? this._hideIf[key] : undefined;
  }

  private getQueueId(key: keyof T) {
    return key in this._validationPromiseCounter
      ? this._validationPromiseCounter[key]
      : 0;
  }

  public getValidateCondition(key: keyof T) {
    return this._validation && key in this._validation
      ? this._validation[key]
      : undefined;
  }

  private isSelectedAction(id: string) {
    this.isSelectedListeners?.get(id)?.();
  }

  private isValidationInProgress() {
    for (let key in this._fields) {
      if (this._fields[key].validationInProgress) {
        return true;
      }
    }

    return false;
  }

  public onChange() {
    this._onChangeCounter++;
    this.onChangeListeners.forEach((listener) => {
      listener(this.isValid);
    });
    this._onChangeCounter--;
    this.afterAll();
  }

  public registerKey(key: keyof T, type: string) {
    const existingItems = this.registeredKeys.filter(
      (item) => item.key === key
    );

    this.registeredKeys.push({ key, type });
    return !existingItems.length
      ? true
      : type === "radio"
      ? !existingItems.some((item) => item.type !== "radio")
      : false;
  }

  private registerQueueId(key: keyof T) {
    if (!(key in this._validationPromiseCounter)) {
      this._validationPromiseCounter[key] = 0;
    }
    return ++this._validationPromiseCounter[key]!;
  }

  public resetForm() {
    this._setController(
      new Controller<T>({
        disableIf: this._disableIf,
        hideIf: this._hideIf,
        initialValues: this._initialValues,
        onSubmit: this._onSubmit,
        setController: this._setController,
        validateOnChange: this._validateOnChange,
        validation: this._validation
      })
    );

    this._isSubmitted = false;
  }

  public setDefaultActiveId(key: keyof T, id?: string) {
    if (key in this._fields) {
      this._fields[key].activeId = id;
    }

    this._defaultActiveId[key] = id;
  }

  public setDefaultIsDisabled({
    id,
    key,
    type
  }: {
    id?: string;
    key: keyof T;
    type?: string;
  }) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isDisabled: true,
        isValid: true
      };
    } else {
      this._fields[key] = {
        validationResult: undefined,
        isDisabled: true,
        isValid: true,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value: this._initialValues?.[key]
      };
    }

    if (type !== "radio" || !id) {
      return;
    }

    if (!this._fields[key].options) {
      this._fields[key].options = new Map();
    }

    if (this._fields[key].options?.has(id)) {
      this._fields[key].options!.get(id)!.isDisabled = true;
    } else {
      this._fields[key].options!.set(id, { isDisabled: true, isVisible: true });
    }

    this._fields[key].isVisible = Array.from(
      this._fields[key].options!.values()
    ).every((item) => item.isDisabled);
  }

  public setDefaultIsInvalid({ key, type }: { key: keyof T; type?: string }) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isValid: false
      };
    } else {
      this._fields[key] = {
        validationResult: undefined,
        isDisabled: false,
        isValid: false,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value: this._initialValues?.[key]
      };
    }

    if (type === "radio" && !this._fields[key].options) {
      this._fields[key].options = new Map();
    }
  }

  public setDefaultIsNotVisible({
    id,
    key,
    type
  }: {
    id?: string;
    key: keyof T;
    type?: string;
  }) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isVisible: false
      };
    } else {
      this._fields[key] = {
        validationResult: undefined,
        isDisabled: false,
        isValid: true,
        isValidated: false,
        isVisible: false,
        validationInProgress: false,
        value: this._initialValues?.[key]
      };
    }

    if (type !== "radio" || !id) {
      return;
    }

    if (!this._fields[key].options) {
      this._fields[key].options = new Map();
    }

    if (this._fields[key].options?.has(id)) {
      this._fields[key].options!.get(id)!.isVisible = false;
    } else {
      this._fields[key].options?.set(id, {
        isDisabled: true,
        isVisible: false
      });
    }

    this._fields[key].isVisible = Array.from(
      this._fields[key].options!.values()
    ).some((item) => item.isVisible);
  }

  public setFieldValue(key: keyof T, value: Value, id?: string) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        activeId: id,
        isValidated: false,
        value
      };
    } else {
      this._fields[key] = {
        activeId: id,
        validationResult: undefined,
        isDisabled: false,
        isValid: true,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value
      };
    }

    if (
      ((this.isSubmitted || this.validateOnChange) &&
        !this._fields[key].isDisabled &&
        this._fields[key].isVisible) ||
      this.validateOnChange
    ) {
      this.validateAll(key);
    } else if (!this._fields[key].isDisabled && this._fields[key].isVisible) {
      this.validateAll(key, true);
    }

    this.onChange();
    this.validateListeners(key);
  }

  private setInitialValues(initialValues: Partial<T>) {
    for (let key in initialValues) {
      this._fields[key] = {
        validationResult: undefined,
        isDisabled: false,
        isValid: true,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value: initialValues[key]
      };
    }
  }

  public setIsDisabled({
    id,
    isDisabled,
    key,
    type
  }: {
    id?: string;
    isDisabled: boolean;
    key: keyof T;
    type?: string;
  }) {
    if (
      (type !== "radio" && this._fields[key]?.isDisabled === isDisabled) ||
      this._fields[key]?.options?.get(id!)?.isDisabled === isDisabled
    ) {
      return;
    }

    let disable = isDisabled;

    if (type === "radio" && id && this._fields[key]?.options?.has(id)) {
      this._fields[key]!.options!.get(id)!.isDisabled = isDisabled;
      disable = Array.from(this._fields[key]!.options!.values()).every(
        (item) => item.isDisabled
      );
    }

    const value =
      (((disable || this._fields[key] === undefined) &&
        !this._fields[key].isDisabled) ||
        isDisabled) &&
      this._fields[key].activeId === id &&
      (!this._initialValues ||
        !(key in this._initialValues) ||
        this._initialValues[key] !== this._fields[key].value)
        ? this._initialValues?.[key]
        : this._fields[key].value;

    if (
      this._defaultActiveId[key] &&
      value === this._initialValues?.[key] &&
      this._defaultActiveId[key] !== this._fields[key].activeId
    ) {
      this._fields[key].activeId = this._defaultActiveId[key];
      this._afterAll.disable.set(key, () => {
        this.isSelectedAction(this._defaultActiveId[key]!);
      });
    }

    this._fields[key] = {
      ...this._fields[key],
      isDisabled: disable,
      isValidated: false,
      value
    };

    this.validateAll(key, true);

    this.onChange();
  }

  public setIsVisible({
    id,
    isVisible,
    key,
    type
  }: {
    id?: string;
    isVisible: boolean;
    key: keyof T;
    type?: string;
  }) {
    if (
      (type !== "radio" && this._fields[key]?.isVisible === isVisible) ||
      this._fields[key]?.options?.get(id!)?.isVisible === isVisible
    ) {
      return;
    }

    let visible = isVisible;

    if (type === "radio" && id && this._fields[key]?.options?.has(id)) {
      this._fields[key]!.options!.get(id)!.isVisible = isVisible;
      visible = Array.from(this._fields[key]!.options!.values()).some(
        (item) => item.isVisible
      );
    }

    if (!isVisible && this._fields[key].activeId === id) {
      this._fields[key].activeId = undefined;
      this._fields[key].value = undefined;
    }

    if (isVisible && this._fields[key].value === undefined) {
      this._fields[key].isValidated = false;
    }

    if (!this._afterAll.visible.has(key)) {
      this._afterAll.visible.set(key, () => {
        if (
          this._fields[key].value === undefined &&
          this._fields[key]?.options?.get(this._defaultActiveId?.[key]!)
            ?.isVisible === true
        ) {
          this._fields[key].value = this._initialValues?.[key];
          this._fields[key] = {
            ...this._fields[key],
            activeId: this._defaultActiveId?.[key]
          };

          this.validateAll(key, !(this.validateOnChange || this.isSubmitted));

          if (this.validateOnChange || this.isSubmitted) {
            this.validateListeners(key);
          }

          this.isSelectedAction(this._defaultActiveId[key]!);
        } else if (
          this._fields[key].value === undefined &&
          this._fields[key]?.options?.get(this._defaultActiveId?.[key]!)
            ?.isVisible === false
        ) {
          this.validateAll(key, !(this.validateOnChange || this.isSubmitted));

          if (this.validateOnChange || this.isSubmitted) {
            this.validateListeners(key);
          }
        }
      });
    }

    if (visible) {
      this.validateAll(key, true);
    } else {
      this._fields[key].isValid = true;
    }

    this._fields[key] = {
      ...this._fields[key],
      isVisible: visible
    };

    this.onChange();
  }

  public async submit() {
    this._isSubmitted = true;
    this.validate();

    if (this.isValidationInProgress()) {
      this.disableButtons(true);

      while (this.isValidationInProgress()) {
        await wait(200);
      }

      this.disableButtons(false);
    }

    if (this.isSubmitted && this._onSubmit && this.isValid) {
      this._onSubmit(this.fields, this);
    }

    return this;
  }

  public subscribeIsSelected(id: string, action: Action) {
    this.isSelectedListeners.set(id, action);
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

  public subscribeOnValidate(listener: OnValidate<T>) {
    this.onValidateListener.add(listener);
  }

  public subscribeValidator({
    action,
    id,
    key,
    type,
    validate
  }: {
    action: ValidatorResultAction;
    id?: string;
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
        validationResult: undefined,
        isDisabled: false,
        isValid: false,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value: this._initialValues?.[key]
      };
    }

    if (type === "radio" && !this._fields[key].options) {
      this._fields[key].options = new Map();
    }

    if (type === "radio" && id) {
      this._fields[key].options?.set(id, {
        isDisabled: false,
        isVisible: true
      });
    }
  }

  public unsubscribeIsSelected(id: string) {
    this.isSelectedListeners.delete(id);
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

  public unsubscribeOnValidate(listener: OnValidate<T>) {
    this.onValidateListener.delete(listener);
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
      if (this._fields[key].isDisabled || !this._fields[key].isVisible) {
        return;
      }

      if (this._fields[key].isValidated && !this._fields[key].isValid) {
        this.validateActions(key, this._fields[key].validationResult);
      }

      if (this._fields[key].isValidated) {
        return;
      }

      const validationResult = validator.validate();

      let isValid: boolean;
      let validationContent: ValidationContentResult;

      if (
        typeof validationResult === "object" &&
        validationResult !== null &&
        "promise" in validationResult
      ) {
        isValid = false;
        validationContent = validationResult.content;

        this._fields[key].validationInProgress = true;

        const queueId = this.registerQueueId(key);

        validationResult
          .promise()
          .then((result) => {
            if (queueId !== this.getQueueId(key)) {
              return;
            }

            this._fields[key] = {
              ...this._fields[key],
              validationResult: result.content,
              isValid: result.isValid,
              isValidated: true,
              validationInProgress: false
            };

            this.validateActions(key, result.content);
          })
          .catch(() => {
            if (queueId !== this.getQueueId(key)) {
              return;
            }

            this._fields[key] = {
              ...this._fields[key],
              validationInProgress: false
            };
          });
      } else if (
        typeof validationResult === "object" &&
        validationResult !== null &&
        "isValid" in validationResult
      ) {
        isValid = validationResult.isValid;
        validationContent = validationResult.content;
      } else {
        isValid = !validationResult;
        validationContent = validationResult;
      }

      this._fields[key] = {
        ...this._fields[key],
        validationResult: validationContent,
        isValid,
        isValidated: true
      };

      this.validateActions(key, validationContent);
    });

    this._afterAll.validate.push(() => {
      this.validateListeners();
    });

    this.onChange();
  }

  private validateActions(
    key: keyof T,
    validationContent: ValidationContentResult
  ) {
    const validator = this.validatorListeners.get(key);
    validator?.actions?.forEach((action) => {
      action(validationContent);
    });
    validator?.action?.(validationContent);
  }

  public validateAll(key: keyof T, silent?: boolean) {
    const validator = this.validatorListeners.get(key);

    if (!validator) {
      return;
    }

    const validationResult = validator.validate();

    let isValid: boolean;
    let validationContent: ValidationContentResult;

    if (
      typeof validationResult === "object" &&
      validationResult !== null &&
      "promise" in validationResult
    ) {
      isValid = false;
      validationContent = validationResult.content;

      this._fields[key].validationInProgress = true;

      const queueId = this.registerQueueId(key);

      validationResult
        .promise()
        .then((result) => {
          if (queueId !== this.getQueueId(key)) {
            return;
          }

          this._fields[key] = {
            ...this._fields[key],
            validationResult: result.content,
            isValid: result.isValid,
            isValidated: true,
            validationInProgress: false
          };

          if (
            !silent &&
            !this._fields[key].isDisabled &&
            this._fields[key].isVisible
          ) {
            this.validateActions(key, result.content);
          }
        })
        .catch(() => {
          if (queueId !== this.getQueueId(key)) {
            return;
          }

          this._fields[key] = {
            ...this._fields[key],
            validationInProgress: false
          };
        });
    } else if (
      typeof validationResult === "object" &&
      validationResult !== null &&
      "isValid" in validationResult
    ) {
      isValid = validationResult.isValid;
      validationContent = validationResult.content;
    } else {
      isValid = !validationResult;
      validationContent = validationResult;
    }

    this._fields[key] = {
      ...this._fields[key],
      validationResult: validationContent,
      isValid,
      isValidated: true
    };

    if (
      !silent &&
      !this._fields[key].isDisabled &&
      this._fields[key].isVisible
    ) {
      this.validateActions(key, validationContent);
    }
  }

  private validateListeners(key?: keyof T) {
    for (let listener of Array.from(this.onValidateListener.values())) {
      if (listener.key in this._fields && (!key || key === listener.key)) {
        listener.action(
          !this._fields[listener.key].isDisabled &&
            this._fields[listener.key].isVisible &&
            (this.validateOnChange || this.isSubmitted),
          this._fields[listener.key].isValid
        );
      }
    }
  }
}
