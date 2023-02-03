export declare type PAlertProps = {
    color: string;
    textColor: string;
    type: 'info' | 'error' | 'success' | 'warning';
    text: boolean;
    tile: boolean;
    dismissible: boolean;
    timeout: number | string;
};
declare const _default: import("vue").DefineComponent<any, void, unknown, {}, {}, import("vue").ComponentOptions<{}, any, any, any, any, any, any, any>, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {} | {
    [x: string]: any;
}>;
export default _default;
