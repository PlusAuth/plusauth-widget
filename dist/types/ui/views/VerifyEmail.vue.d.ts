import { resolveClientLogo } from '../utils';
declare const _default: import("vue").DefineComponent<{
    features: {
        type: ObjectConstructor;
        default: () => {
            socialConnections: boolean;
            signUp: boolean;
            resetPassword: boolean;
        };
    };
}, {
    time: import("vue").Ref<number>;
    context: any;
    actionCompleted: import("vue").Ref<boolean>;
    error: any;
    loginUrl: any;
    resendLink: string;
    resolveClientLogo: typeof resolveClientLogo;
    queryParams: Record<string, string> | null;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    features: {
        type: ObjectConstructor;
        default: () => {
            socialConnections: boolean;
            signUp: boolean;
            resetPassword: boolean;
        };
    };
}>>, {
    features: Record<string, any>;
}>;
export default _default;
