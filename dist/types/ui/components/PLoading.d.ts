import { ComponentPublicInstance, VNode } from 'vue';
declare function genCircle(this: ComponentPublicInstance<any>, name: string, offset: string | number): VNode;
declare function genSvg(this: ComponentPublicInstance<any>): VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>;
declare function genInfo(this: ComponentPublicInstance<any>): VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>;
declare const _default: import("vue").DefineComponent<any, {
    normalizedValue: import("vue").ComputedRef<number>;
    calculatedSize: import("vue").ComputedRef<number>;
    circumference: import("vue").ComputedRef<number>;
    classes: import("vue").ComputedRef<{
        'pa__progress-circular--indeterminate': any;
        'pa__progress-circular--button': any;
    }>;
    strokeWidth: import("vue").ComputedRef<number>;
    strokeDashOffset: import("vue").ComputedRef<number>;
    viewBoxSize: import("vue").ComputedRef<number>;
    strokeDashArray: import("vue").ComputedRef<number>;
    styles: import("vue").ComputedRef<{
        height: string | undefined;
        width: string | undefined;
    }>;
    svgStyles: import("vue").ComputedRef<{
        transform: string;
    }>;
    genSvg: typeof genSvg;
    genCircle: typeof genCircle;
    genInfo: typeof genInfo;
}, unknown, {}, {}, import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any>, {} | {
    [x: string]: any;
}>;
export default _default;
