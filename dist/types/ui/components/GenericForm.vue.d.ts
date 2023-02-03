import { AdditionalFields } from '../interfaces';
import { PAlertProps } from './PAlert';
declare const _default: import("vue").DefineComponent<{
    submit: {
        type: () => any;
        required: true;
        default: () => boolean;
    };
    validate: {
        type: () => any;
        default: () => boolean;
    };
    fields: {
        type: () => AdditionalFields;
        default: () => {};
    };
}, {
    formRef: any;
    alert: import("vue").Ref<boolean>;
    alertMsg: import("vue").Ref<string | null>;
    alertOptions: Record<string, any>;
    sortedFields: import("vue").ComputedRef<{}>;
    /**
     * @param message Message to display in alert. Pass null or undefined to hide alert.
     * @param options PAlert properties
     */
    toggleAlert(message?: string | null, options?: Partial<PAlertProps>): void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    submit: {
        type: () => any;
        required: true;
        default: () => boolean;
    };
    validate: {
        type: () => any;
        default: () => boolean;
    };
    fields: {
        type: () => AdditionalFields;
        default: () => {};
    };
}>>, {
    submit: any;
    validate: any;
    fields: AdditionalFields;
}>;
export default _default;
