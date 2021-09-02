import React from "react";
import {
  Action,
  AfterAll,
  ControllerProps,
  DefaultActiveRadioId,
  DefaultDisabledRadioId,
  DisableIf,
  FieldAdditionalProperties,
  Fields,
  FieldTypes,
  FormFields,
  HideIf,
  KeyType,
  OnChangeAction,
  OnDisable,
  OnDisableAction,
  OnSubmit,
  OnValidate,
  SetDefaultIsDisabled,
  SetDefaultIsInvalid,
  SetDefaultIsNotVisible,
  SetIsDisabled,
  SetIsVisible,
  SubscribeValidator,
  Validation,
  ValidationContentResult,
  ValidationDependencies,
  ValidationPromise,
  ValidationPromiseCounter,
  ValidationPromiseResult,
  ValidationResult,
  Validator,
  ValidatorResultAction,
  Value
} from "./controller.types";
import { wait } from "./utils/utils";

export class Controller<T extends FormFields<T>> {
  static uniqueIndex: number = 0;

  private _afterAll: AfterAll<T> = {
    disable: new Map(),
    validate: [],
    validateAll: new Map(),
    visible: new Map()
  };
  private _defaultActiveRadioId: DefaultActiveRadioId<T> = {};
  private _defaultDisabledRadioId: DefaultDisabledRadioId<T> = {};
  private _disableIf?: DisableIf<T>;
  private _fields: Fields<T> = {};
  private _hideIf?: HideIf<T>;
  private _initialRender = true;
  private _initialValidation?: boolean;
  private _initialValues?: Partial<T>;
  private _isSubmitted = false;
  private _onChangeCounter = 0;
  private _onSubmit?: OnSubmit<T>;
  private _setController: React.Dispatch<
    React.SetStateAction<Controller<T> | undefined>
  >;
  private _validateOnChange;
  private _validation?: Validation<T>;
  private _validationPromiseCounter: ValidationPromiseCounter<T> = {};

  private isSelectedListeners = new Map<string, Action>();
  private keyIndex: number;
  private onChangeListeners = new Set<OnChangeAction>();
  private onDisableListeners = new Set<OnDisable<T>>();
  private onDisableButtonListeners = new Set<OnDisableAction>();
  private onValidateListener = new Set<OnValidate<T>>();
  private registeredKeys: KeyType<T>[] = [];
  private validationDependencies: ValidationDependencies<T> = {};
  private validatorListeners = new Map<keyof T, Validator>();

  constructor({
    disableIf,
    hideIf,
    initialValidation,
    initialValues,
    onSubmit,
    setController,
    validateOnChange = false,
    validation
  }: ControllerProps<T>) {
    if (initialValues) {
      this.setInitialValues(initialValues);
      this._initialValues = initialValues;
    }
    if (onSubmit) {
      this._onSubmit = onSubmit;
    }

    this._disableIf = disableIf;
    this._hideIf = hideIf;
    this._initialValidation = initialValidation;
    this._setController = setController;
    this._validation = validation;
    this._validateOnChange = validateOnChange;

    this.keyIndex = Controller.uniqueIndex++;
  }

  get fields(): Partial<T> {
    const result: Partial<T> = {};

    for (let key in this._fields) {
      if (this._fields[key]!.isVisible) {
        (result[key] as Value) = this._fields[key]?.value;
      }
    }

    return result;
  }

  get isSubmitted() {
    return this._isSubmitted;
  }

  get isValid() {
    return Object.keys(this._fields).every((key) => this._fields[key]?.isValid);
  }

  get key() {
    return this.keyIndex;
  }

  private afterAll() {
    if (this._onChangeCounter === 0) {
      Object.values(this._afterAll).forEach((member) => {
        member.forEach((action) => {
          action();
        });
      });

      this._afterAll = {
        disable: new Map(),
        validate: [],
        validateAll: new Map(),
        visible: new Map()
      };
    }
  }

  private canFieldBeValidated(key: keyof T) {
    return (
      this._fields[key]?.validateOnChange ||
      this._validateOnChange ||
      this.isSubmitted
    );
  }

  public deleteField(key: keyof T, id?: string) {
    if (!(key in this._fields)) {
      return;
    }

    if (id && this._fields[key]?.options?.has(id)) {
      this._fields[key]!.options!.delete(id);
    }

    if (this._fields[key]?.activeId === id) {
      this._fields[key]!.activeId = undefined;
    }

    if (!this._fields[key]?.options?.size) {
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
          this._fields[listener.key]?.isDisabled === false) ||
        !(listener.key in this._fields)
      ) {
        listener.action(disable);
      }
    });

    this.disableButtons(disable);
  }

  private disabledRadiosExceptDefault(key: keyof T) {
    if (!this._defaultActiveRadioId[key] || !this._fields[key]?.options) {
      return false;
    }

    const entries = Object.fromEntries(this._fields[key]!.options!.entries());

    for (let id in entries) {
      if (id === this._defaultActiveRadioId[key]) {
        continue;
      }

      if (!entries[id].isDisabled) {
        return false;
      }
    }

    return true;
  }

  private executePromise(
    key: keyof T,
    promise: ValidationPromise,
    onSuccess?: (result: ValidationPromiseResult) => void
  ) {
    this._fields[key]!.validationInProgress = true;

    const queueId = this.registerQueueId(key);

    promise()
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

        if (onSuccess) {
          onSuccess(result);
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
  }

  private getDependencyList(key: keyof T, dependencyList: (keyof T)[] = [key]) {
    for (let _key in this.validationDependencies) {
      if (
        this.validationDependencies[_key]?.has(key) &&
        !dependencyList.includes(_key)
      ) {
        dependencyList.push(_key);
        this.getDependencyList(_key, dependencyList);
      }
    }

    return dependencyList.slice(1);
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
    return key in this._fields ? (this._fields[key]!.value as T[K]) : undefined;
  }

  public getHideCondition(key: keyof T) {
    return this._hideIf && key in this._hideIf ? this._hideIf[key] : undefined;
  }

  public getObservedFields(key: keyof T) {
    return this._initialRender && Proxy !== undefined
      ? new Proxy<Partial<T>>(
          {},
          {
            get: (_, prop) => {
              if (!(key in this.validationDependencies)) {
                this.validationDependencies[key] = new Set();
              }

              if (prop !== key) {
                this.validationDependencies[key]?.add(prop as keyof T);
              }

              return this._fields[prop]?.isVisible
                ? this._fields[prop]?.value
                : undefined;
            }
          }
        )
      : this.fields;
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

  private getValidationHasPromise(validationResult: ValidationResult) {
    return (
      typeof validationResult === "object" &&
      validationResult !== null &&
      "promise" in validationResult
    );
  }

  private getValidationResultBoolean(validationResult: ValidationResult) {
    return (
      !validationResult ||
      (typeof validationResult === "object" &&
        validationResult !== null &&
        (("isValid" in validationResult && validationResult.isValid) ||
          "promise" in validationResult))
    );
  }

  public getValidationResultContent(validationResult: ValidationResult) {
    if (
      validationResult !== undefined &&
      typeof validationResult === "object" &&
      validationResult !== null &&
      ("isValid" in validationResult || "promise" in validationResult)
    ) {
      return "isValid" in validationResult
        ? validationResult.content
        : undefined;
    }
    return validationResult;
  }

  public initialRenderDone() {
    this._initialRender = false;
  }

  private isSelectedAction(id?: string) {
    if (id) {
      this.isSelectedListeners?.get(id)?.();
    }
  }

  private isValidationInProgress() {
    for (let key in this._fields) {
      if (this._fields[key]!.validationInProgress) {
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

  public registerKey(key: keyof T, type: FieldTypes) {
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

  public registerValidationDependencies(
    key: keyof T,
    dependencies: (keyof T)[]
  ) {
    if (!(key in this.validationDependencies)) {
      this.validationDependencies[key] = new Set();
    }

    for (let _key of dependencies) {
      if (key !== _key) {
        this.validationDependencies[key]?.add(_key);
      }
    }
  }

  public resetForm() {
    this._setController(
      new Controller<T>({
        disableIf: this._disableIf,
        hideIf: this._hideIf,
        initialValidation: this._initialValidation,
        initialValues: this._initialValues,
        onSubmit: this._onSubmit,
        setController: this._setController,
        validateOnChange: this._validateOnChange,
        validation: this._validation
      })
    );

    this._isSubmitted = false;
  }

  public setDefaultActiveRadioId(key: keyof T, id?: string) {
    if (key in this._fields) {
      this._fields[key]!.activeId = id;
    }

    this._defaultActiveRadioId[key] = id;
  }

  public setDefaultIsDisabled({
    id,
    isValidated,
    key,
    type,
    validationResult
  }: SetDefaultIsDisabled<T>) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isDisabled: true,
        isValidated:
          isValidated && !this.getValidationHasPromise(validationResult),
        isValid: this.getValidationResultBoolean(validationResult),
        validationResult: this.getValidationResultContent(validationResult)
      };
    } else {
      this._fields[key] = {
        isDisabled: true,
        isValid: this.getValidationResultBoolean(validationResult),
        isValidated:
          isValidated && !this.getValidationHasPromise(validationResult),
        isVisible: true,
        validationInProgress: false,
        validationResult: this.getValidationResultContent(validationResult),
        value: this._initialValues?.[key]
      };
    }

    if (type !== "radio" || !id) {
      return;
    }

    if (!this._fields[key]!.options) {
      this._fields[key]!.options = new Map();
    }

    if (this._fields[key]!.options?.has(id)) {
      this._fields[key]!.options!.get(id)!.isDisabled = true;
    } else {
      this._fields[key]!.options!.set(id, {
        isDisabled: true,
        isVisible: true
      });
    }

    this._fields[key]!.isDisabled = Array.from(
      this._fields[key]!.options!.values()
    ).every((item) => item.isDisabled);

    if (!(key in this._defaultDisabledRadioId)) {
      this._defaultDisabledRadioId[key] = [];
    }

    this._defaultDisabledRadioId[key]!.push(id);
  }

  public setDefaultIsValid({
    initialValidation,
    isValidated,
    key,
    type,
    validationResult
  }: SetDefaultIsInvalid<T>) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isValid: this.getValidationResultBoolean(validationResult),
        isValidated:
          !initialValidation &&
          isValidated &&
          !this.getValidationHasPromise(validationResult),
        validationResult: this.getValidationResultContent(validationResult)
      };
    } else {
      this._fields[key] = {
        isDisabled: false,
        isValid: this.getValidationResultBoolean(validationResult),
        isValidated:
          !initialValidation &&
          isValidated &&
          !this.getValidationHasPromise(validationResult),
        isVisible: true,
        validationInProgress: false,
        validationResult: this.getValidationResultContent(validationResult),
        value: this._initialValues?.[key]
      };
    }

    if (type === "radio" && !this._fields[key]!.options) {
      this._fields[key]!.options = new Map();
    }
  }

  public setDefaultIsNotVisible({
    id,
    isValidated,
    key,
    type,
    validationResult,
    value
  }: SetDefaultIsNotVisible<T>) {
    if (
      key in this._fields &&
      this._fields[key]!.value !== undefined &&
      this._fields[key]!.value === value
    ) {
      this._afterAll.validate.push(() => {
        this._fields[key]!.value = undefined;
        this.validateAll(key, true);
      });
    }

    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        isValid: this.getValidationResultBoolean(validationResult),
        isValidated:
          isValidated && !this.getValidationHasPromise(validationResult),
        isVisible: false,
        validationResult: this.getValidationResultContent(validationResult)
      };
    } else {
      this._fields[key] = {
        isDisabled: false,
        isValid: this.getValidationResultBoolean(validationResult),
        isValidated:
          isValidated && !this.getValidationHasPromise(validationResult),
        isVisible: false,
        validationInProgress: false,
        validationResult: this.getValidationResultContent(validationResult),
        value: this._initialValues?.[key]
      };
    }

    if (type !== "radio" || !id) {
      return;
    }

    if (!this._fields[key]?.options) {
      this._fields[key]!.options = new Map();
    }

    if (this._fields[key]!.options?.has(id)) {
      this._fields[key]!.options!.get(id)!.isVisible = false;
    } else {
      this._fields[key]!.options?.set(id, {
        isDisabled: true,
        isVisible: false
      });
    }

    this._fields[key]!.isVisible = Array.from(
      this._fields[key]!.options!.values()
    ).some((item) => item.isVisible);
  }

  public setFieldProperties(key: keyof T, props: FieldAdditionalProperties) {
    if (key in this._fields) {
      this._fields[key] = {
        ...this._fields[key],
        ...props
      };
    } else {
      this._fields[key] = {
        ...props,
        activeId: undefined,
        validationResult: undefined,
        isDisabled: false,
        isValid: true,
        isValidated: false,
        isVisible: true,
        validationInProgress: false,
        value: undefined
      };
    }
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
      this.canFieldBeValidated(key) &&
      !this._fields[key]!.isDisabled &&
      this._fields[key]!.isVisible
    ) {
      this.validateAll(key);
      this.validateAllDependencies(key);
    } else if (!this._fields[key]!.isDisabled && this._fields[key]!.isVisible) {
      this.validateAll(key, true);
      this.validateAllDependencies(key, true);
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

  public setIsDisabled({ id, isDisabled, key, type }: SetIsDisabled<T>) {
    if (
      this._fields[key] === undefined ||
      (type !== "radio" && this._fields[key]!.isDisabled === isDisabled) ||
      (id &&
        this._fields[key]!.options &&
        this._fields[key]!.options!.get(id)?.isDisabled === isDisabled)
    ) {
      return;
    }

    let disable = isDisabled;

    if (type === "radio" && id && this._fields[key]!.options?.has(id)) {
      this._fields[key]!.options!.get(id)!.isDisabled = isDisabled;
      disable = Array.from(this._fields[key]!.options!.values()).every(
        (item) => item.isDisabled
      );
      this.setIsDisabledAfterAll(key);
    }

    let value =
      disable || this._fields[key]!.options === undefined
        ? this._initialValues?.[key]
        : isDisabled &&
          this._fields[key]!.activeId === id &&
          id !== this._defaultActiveRadioId[key]
        ? undefined
        : this._fields[key]!.value;

    if (
      isDisabled &&
      this._fields[key]!.activeId === id &&
      this._defaultActiveRadioId[key] &&
      this._defaultDisabledRadioId[key]?.includes(
        this._defaultActiveRadioId[key]!
      )
    ) {
      value = this._initialValues?.[key];
      this.isSelectedAction(this._defaultActiveRadioId[key]);
    }

    this._fields[key] = {
      ...this._fields[key],
      isDisabled: disable,
      isValidated: false,
      value
    };

    if (type === "radio") {
      this._afterAll.validateAll.set(key, () => {
        this.validateAll(key, true);
      });
    } else {
      this.validateAll(key, true);
    }

    this.onChange();
  }

  private setIsDisabledAfterAll(key: keyof T) {
    this._afterAll.disable.set(key, () => {
      if (this.disabledRadiosExceptDefault(key)) {
        this._fields[key] = {
          ...this._fields[key],
          activeId: this._defaultActiveRadioId[key],
          value: this._initialValues?.[key]
        };
        this.validateAll(key, true);
        this.isSelectedAction(this._defaultActiveRadioId[key]);
      }
    });
  }

  public setIsVisible({ id, isVisible, key, type }: SetIsVisible<T>) {
    if (
      this._fields[key] === undefined ||
      (type !== "radio" && this._fields[key]?.isVisible === isVisible) ||
      this._fields[key]?.options?.get(id!)?.isVisible === isVisible
    ) {
      return;
    }

    let visible = isVisible;

    if (
      type === "radio" &&
      id &&
      this._fields[key]!.options &&
      this._fields[key]!.options?.has(id)
    ) {
      this._fields[key]!.options!.get(id)!.isVisible = isVisible;
      visible = Array.from(this._fields[key]!.options!.values()).some(
        (item) => item.isVisible
      );
    }

    if (!isVisible && this._fields[key]!.activeId === id) {
      this._fields[key]!.activeId = undefined;
      this._fields[key]!.value = undefined;
    }

    if (isVisible && this._fields[key]!.value === undefined) {
      this._fields[key]!.isValidated = false;
    }

    if (type !== "radio" && visible && this._fields[key]!.value === undefined) {
      this._fields[key]!.value = this._initialValues?.[key];
    }

    if (type === "radio" && !this._afterAll.visible.has(key)) {
      this.setIsVisibleAfterAll(key);
    }

    this._fields[key] = {
      ...this._fields[key],
      isVisible: visible
    };

    if (
      type !== "radio" &&
      visible &&
      this.canFieldBeValidated(key) &&
      (!this._fields[key]!.isValid ||
        this._fields[key]!.validationResult !== undefined)
    ) {
      this.validateAll(key);
    } else if (visible) {
      this.validateAll(key, true);
    } else if (type !== "radio") {
      this._fields[key]!.isValid = true;
    }

    this.onChange();
  }

  private setIsVisibleAfterAll(key: keyof T) {
    this._afterAll.visible.set(key, () => {
      if (
        this._fields[key]!.value === undefined &&
        this._fields[key]!.options?.get(this._defaultActiveRadioId?.[key]!)
          ?.isVisible === true
      ) {
        this._fields[key]!.value = this._initialValues?.[key];
        this._fields[key] = {
          ...this._fields[key],
          activeId: this._defaultActiveRadioId?.[key]
        };

        this.validateAll(key, !this.canFieldBeValidated(key));
        this.validateListenersOnChange(key);
        this.isSelectedAction(this._defaultActiveRadioId[key]!);
      } else if (
        this._fields[key]!.value === undefined &&
        this._fields[key]!.options?.get(this._defaultActiveRadioId?.[key]!)
          ?.isVisible === false
      ) {
        this.validateAll(key, !this.canFieldBeValidated(key));
        this.validateListenersOnChange(key);
      }
    });
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
  }: SubscribeValidator<T>) {
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

    if (type === "radio" && !this._fields[key]?.options) {
      this._fields[key]!.options = new Map();
    }

    if (type === "radio" && id) {
      this._fields[key]!.options?.set(id, {
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
      if (
        this._fields[key] === undefined ||
        this._fields[key]!.isDisabled ||
        !this._fields[key]!.isVisible
      ) {
        return;
      }

      if (this._fields[key]!.isValidated && !this._fields[key]!.isValid) {
        this.validateActions(key, this._fields[key]!.validationResult);
      }

      if (this._fields[key]!.isValidated) {
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

        this.executePromise(key, validationResult.promise, (result) => {
          this.validateActions(key, result.content);
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

      this.executePromise(key, validationResult.promise, (result) => {
        if (
          !silent &&
          !this._fields[key]!.isDisabled &&
          this._fields[key]!.isVisible
        ) {
          this.validateActions(key, result.content);
        }
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
      !this._fields[key]!.isDisabled &&
      this._fields[key]!.isVisible
    ) {
      this.validateActions(key, validationContent);
    }
  }

  private validateAllDependencies(key: keyof T, silent?: boolean) {
    const dependencies = this.getDependencyList(key);

    for (let _key of dependencies) {
      this.validateAll(_key, silent);
    }
  }

  private validateListeners(key?: keyof T) {
    for (let listener of Array.from(this.onValidateListener.values())) {
      if (listener.key in this._fields && (!key || key === listener.key)) {
        listener.action(
          !this._fields[listener.key]!.isDisabled &&
            this._fields[listener.key]!.isVisible &&
            this.canFieldBeValidated(listener.key),
          this._fields[listener.key]!.isValid,
          this._fields[listener.key]?.validationResult
        );
      }
    }
  }

  private validateListenersOnChange(key: keyof T) {
    if (this.canFieldBeValidated(key)) {
      this.validateListeners(key);
    }
  }
}
