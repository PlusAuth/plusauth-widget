declare const _default: import("vue").DefineComponent<any, {
    inputRef: import("vue").Ref<string>;
    popoverRef: import("vue").Ref<HTMLElement>;
    containerRef: import("vue").Ref<Element>;
    popperInstance: import("vue").Ref<{
        state: {
            elements: {
                reference: Element | {
                    getBoundingClientRect: () => ClientRect | DOMRect;
                    contextElement?: Element | undefined;
                };
                popper: HTMLElement;
                arrow?: HTMLElement | undefined;
            };
            options: {
                placement: import("@popperjs/core/lib/enums").Placement;
                modifiers: any[];
                strategy: import("@popperjs/core/lib/types").PositioningStrategy;
                onFirstUpdate?: ((arg0: Partial<import("@popperjs/core/lib/types").State>) => void) | undefined;
            };
            placement: import("@popperjs/core/lib/enums").Placement;
            strategy: import("@popperjs/core/lib/types").PositioningStrategy;
            orderedModifiers: {
                name: any;
                enabled: boolean;
                phase: import("@popperjs/core/lib/enums").ModifierPhases;
                requires?: string[] | undefined;
                requiresIfExists?: string[] | undefined;
                fn: (arg0: import("@popperjs/core/lib/types").ModifierArguments<any>) => void | import("@popperjs/core/lib/types").State;
                effect?: ((arg0: import("@popperjs/core/lib/types").ModifierArguments<any>) => void | (() => void)) | undefined;
                options?: Partial<any> | undefined;
                data?: import("@popperjs/core/lib/types").Obj | undefined;
            }[];
            rects: {
                reference: {
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                };
                popper: {
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                };
            };
            scrollParents: {
                reference: (Element | {
                    innerHeight: number;
                    offsetHeight: number;
                    innerWidth: number;
                    offsetWidth: number;
                    pageXOffset: number;
                    pageYOffset: number;
                    getComputedStyle: typeof getComputedStyle;
                    addEventListener: (type: any, listener: any, optionsOrUseCapture?: any) => void;
                    removeEventListener: (type: any, listener: any, optionsOrUseCapture?: any) => void;
                    Element: Element;
                    HTMLElement: HTMLElement;
                    Node: Node;
                    toString: () => "[object Window]";
                    devicePixelRatio: number;
                    visualViewport?: {
                        addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
                        dispatchEvent: (event: Event) => boolean;
                        removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined) => void;
                        width: number;
                        height: number;
                        offsetLeft: number;
                        offsetTop: number;
                        scale: number;
                    } | undefined;
                    ShadowRoot: ShadowRoot;
                } | {
                    addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
                    dispatchEvent: (event: Event) => boolean;
                    removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined) => void;
                    width: number;
                    height: number;
                    offsetLeft: number;
                    offsetTop: number;
                    scale: number;
                })[];
                popper: (Element | {
                    innerHeight: number;
                    offsetHeight: number;
                    innerWidth: number;
                    offsetWidth: number;
                    pageXOffset: number;
                    pageYOffset: number;
                    getComputedStyle: typeof getComputedStyle;
                    addEventListener: (type: any, listener: any, optionsOrUseCapture?: any) => void;
                    removeEventListener: (type: any, listener: any, optionsOrUseCapture?: any) => void;
                    Element: Element;
                    HTMLElement: HTMLElement;
                    Node: Node;
                    toString: () => "[object Window]";
                    devicePixelRatio: number;
                    visualViewport?: {
                        addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
                        dispatchEvent: (event: Event) => boolean;
                        removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined) => void;
                        width: number;
                        height: number;
                        offsetLeft: number;
                        offsetTop: number;
                        scale: number;
                    } | undefined;
                    ShadowRoot: ShadowRoot;
                } | {
                    addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
                    dispatchEvent: (event: Event) => boolean;
                    removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined) => void;
                    width: number;
                    height: number;
                    offsetLeft: number;
                    offsetTop: number;
                    scale: number;
                })[];
            };
            styles: {
                [key: string]: Partial<CSSStyleDeclaration>;
            };
            attributes: {
                [key: string]: {
                    [key: string]: string | boolean;
                };
            };
            modifiersData: {
                [x: string]: any;
                arrow?: {
                    x?: number | undefined;
                    y?: number | undefined;
                    centerOffset: number;
                } | undefined;
                hide?: {
                    isReferenceHidden: boolean;
                    hasPopperEscaped: boolean;
                    referenceClippingOffsets: {
                        top: number;
                        left: number;
                        right: number;
                        bottom: number;
                    };
                    popperEscapeOffsets: {
                        top: number;
                        left: number;
                        right: number;
                        bottom: number;
                    };
                } | undefined;
                offset?: {
                    top?: {
                        y: number;
                        x: number;
                    } | undefined;
                    left?: {
                        y: number;
                        x: number;
                    } | undefined;
                    right?: {
                        y: number;
                        x: number;
                    } | undefined;
                    bottom?: {
                        y: number;
                        x: number;
                    } | undefined;
                    auto?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "auto-start"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "auto-end"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "top-start"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "top-end"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "bottom-start"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "bottom-end"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "right-start"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "right-end"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "left-start"?: {
                        y: number;
                        x: number;
                    } | undefined;
                    "left-end"?: {
                        y: number;
                        x: number;
                    } | undefined;
                } | undefined;
                preventOverflow?: {
                    y: number;
                    x: number;
                } | undefined;
                popperOffsets?: {
                    y: number;
                    x: number;
                } | undefined;
            };
            reset: boolean;
        };
        destroy: () => void;
        forceUpdate: () => void;
        update: () => Promise<Partial<import("@popperjs/core/lib/types").State>>;
        setOptions: (setOptionsAction: Partial<import("@popperjs/core/lib/types").OptionsGeneric<any>> | ((prev: Partial<import("@popperjs/core/lib/types").OptionsGeneric<any>>) => Partial<import("@popperjs/core/lib/types").OptionsGeneric<any>>)) => Promise<Partial<import("@popperjs/core/lib/types").State>>;
    }>;
    isOpen: import("vue").Ref<boolean>;
    isFocused: import("vue").Ref<boolean>;
    isActivated: import("vue").Ref<boolean>;
    lazyValue: import("vue").Ref<null>;
    selectedItem: import("vue").Ref<null>;
}, unknown, {
    internalValue: {
        get(): any;
        set(val: any): void;
    };
    messagesToDisplay(): string[];
}, {
    getText(item: string | Record<string, any>): any;
    getValue(item: string | Record<string, any>): any;
    genIcon(): import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    genItems(): import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    focus(): void;
}, import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>, import("vue").ComponentOptionsMixin, ("click" | "focus" | "keydown" | "change" | "input" | "update:modelValue" | "blur" | "update:error")[], "click" | "focus" | "keydown" | "change" | "input" | "update:modelValue" | "blur" | "update:error", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any> & {
    onClick?: ((...args: any[]) => any) | undefined;
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
