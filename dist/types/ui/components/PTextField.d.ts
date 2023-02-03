declare const _default: import("vue").DefineComponent<any, {
    inputRef: import("vue").Ref<string>;
    isFocused: import("vue").Ref<boolean>;
    isActivated: import("vue").Ref<boolean>;
    lazyValue: import("vue").Ref<any>;
}, unknown, {
    internalValue: {
        get(): any;
        set(val: any): void;
    };
    messagesToDisplay(): string[];
}, {
    reset(): void;
    focus(): void;
    blur(): void;
}, import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>, import("vue").ComponentOptionsMixin, ("focus" | "keydown" | "change" | "input" | "update:modelValue" | "blur" | "update:error")[], "focus" | "keydown" | "change" | "input" | "update:modelValue" | "blur" | "update:error", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any> & {
    onFocus?: ((...args: any[]) => any) | undefined;
    onKeydown?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onInput?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
    "onUpdate:error"?: ((...args: any[]) => any) | undefined;
}, {} | {
    [x: string]: any;
}>;
export default _default;
