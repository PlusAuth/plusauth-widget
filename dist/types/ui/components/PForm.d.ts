declare const _default: import("vue").DefineComponent<{
    lazyValidation: BooleanConstructor;
    value: BooleanConstructor;
}, unknown, {
    inputs: any;
    errorBag: any;
}, {}, {
    /** @dev */
    validate(): Promise<boolean>;
    /** @dev */
    reset(): void;
    resetErrorBag(): void;
    /** @dev */
    resetValidation(): void;
    register(input: any): void;
    unregister(input: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("input" | "submit")[], "input" | "submit", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    lazyValidation: BooleanConstructor;
    value: BooleanConstructor;
}>> & {
    onInput?: ((...args: any[]) => any) | undefined;
    onSubmit?: ((...args: any[]) => any) | undefined;
}, {
    lazyValidation: boolean;
    value: boolean;
}>;
export default _default;
