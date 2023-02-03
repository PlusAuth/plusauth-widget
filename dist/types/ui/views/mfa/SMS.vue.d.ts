import { AdditionalFields } from '../../interfaces';
declare const _default: import("vue").DefineComponent<{
    fields: {
        type: () => AdditionalFields;
        default: () => AdditionalFields;
    };
    responseErrorHandler: {
        type: (...arg: any) => any;
        default: () => () => null;
    };
    timerEnabled: {
        type: () => boolean;
        default: boolean;
    };
}, {
    loading: import("vue").Ref<boolean>;
    finalFields: {
        [x: string]: any;
    };
    form: import("vue").Ref<{
        [x: string]: any;
        setup?: ((this: void, props: Readonly<import("@vue/shared").LooseRequired<{}>>, ctx: import("vue").SetupContext<any>) => any) | undefined;
        name?: string | undefined;
        template?: string | object | undefined;
        render?: Function | undefined;
        components?: Record<string, import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions>> | undefined;
        directives?: Record<string, import("vue").Directive<any, any>> | undefined;
        inheritAttrs?: boolean | undefined;
        emits?: any;
        expose?: string[] | undefined;
        serverPrefetch?: (() => Promise<any>) | undefined;
        compilerOptions?: {
            isCustomElement?: ((tag: string) => boolean) | undefined;
            whitespace?: "preserve" | "condense" | undefined;
            comments?: boolean | undefined;
            delimiters?: [string, string] | undefined;
        } | undefined;
        call?: ((this: unknown, ...args: unknown[]) => never) | undefined;
        __isFragment?: undefined;
        __isTeleport?: undefined;
        __isSuspense?: undefined;
        __defaults?: {} | undefined;
        compatConfig?: {
            GLOBAL_MOUNT?: boolean | "suppress-warning" | undefined;
            GLOBAL_MOUNT_CONTAINER?: boolean | "suppress-warning" | undefined;
            GLOBAL_EXTEND?: boolean | "suppress-warning" | undefined;
            GLOBAL_PROTOTYPE?: boolean | "suppress-warning" | undefined;
            GLOBAL_SET?: boolean | "suppress-warning" | undefined;
            GLOBAL_DELETE?: boolean | "suppress-warning" | undefined;
            GLOBAL_OBSERVABLE?: boolean | "suppress-warning" | undefined;
            GLOBAL_PRIVATE_UTIL?: boolean | "suppress-warning" | undefined;
            CONFIG_SILENT?: boolean | "suppress-warning" | undefined;
            CONFIG_DEVTOOLS?: boolean | "suppress-warning" | undefined;
            CONFIG_KEY_CODES?: boolean | "suppress-warning" | undefined;
            CONFIG_PRODUCTION_TIP?: boolean | "suppress-warning" | undefined;
            CONFIG_IGNORED_ELEMENTS?: boolean | "suppress-warning" | undefined;
            CONFIG_WHITESPACE?: boolean | "suppress-warning" | undefined;
            CONFIG_OPTION_MERGE_STRATS?: boolean | "suppress-warning" | undefined;
            INSTANCE_SET?: boolean | "suppress-warning" | undefined;
            INSTANCE_DELETE?: boolean | "suppress-warning" | undefined;
            INSTANCE_DESTROY?: boolean | "suppress-warning" | undefined;
            INSTANCE_EVENT_EMITTER?: boolean | "suppress-warning" | undefined;
            INSTANCE_EVENT_HOOKS?: boolean | "suppress-warning" | undefined;
            INSTANCE_CHILDREN?: boolean | "suppress-warning" | undefined;
            INSTANCE_LISTENERS?: boolean | "suppress-warning" | undefined;
            INSTANCE_SCOPED_SLOTS?: boolean | "suppress-warning" | undefined;
            INSTANCE_ATTRS_CLASS_STYLE?: boolean | "suppress-warning" | undefined;
            OPTIONS_DATA_FN?: boolean | "suppress-warning" | undefined;
            OPTIONS_DATA_MERGE?: boolean | "suppress-warning" | undefined;
            OPTIONS_BEFORE_DESTROY?: boolean | "suppress-warning" | undefined;
            OPTIONS_DESTROYED?: boolean | "suppress-warning" | undefined;
            WATCH_ARRAY?: boolean | "suppress-warning" | undefined;
            PROPS_DEFAULT_THIS?: boolean | "suppress-warning" | undefined;
            V_ON_KEYCODE_MODIFIER?: boolean | "suppress-warning" | undefined;
            CUSTOM_DIR?: boolean | "suppress-warning" | undefined;
            ATTR_FALSE_VALUE?: boolean | "suppress-warning" | undefined;
            ATTR_ENUMERATED_COERCION?: boolean | "suppress-warning" | undefined;
            TRANSITION_CLASSES?: boolean | "suppress-warning" | undefined;
            TRANSITION_GROUP_ROOT?: boolean | "suppress-warning" | undefined;
            COMPONENT_ASYNC?: boolean | "suppress-warning" | undefined;
            COMPONENT_FUNCTIONAL?: boolean | "suppress-warning" | undefined;
            COMPONENT_V_MODEL?: boolean | "suppress-warning" | undefined;
            RENDER_FUNCTION?: boolean | "suppress-warning" | undefined;
            FILTERS?: boolean | "suppress-warning" | undefined;
            PRIVATE_APIS?: boolean | "suppress-warning" | undefined;
            MODE?: 2 | 3 | ((comp: import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions> | null) => 2 | 3) | undefined;
        } | undefined;
        data?: ((this: import("vue").CreateComponentPublicInstance<{}, {}, {}, {}, import("vue").MethodOptions, any, any, {}, {}, {}, false, {
            P: {};
            B: {};
            D: {};
            C: import("vue").ComputedOptions;
            M: import("vue").MethodOptions;
            Defaults: {};
        } & {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, {}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, {}>, vm: import("vue").CreateComponentPublicInstance<{}, {}, {}, {}, import("vue").MethodOptions, any, any, {}, {}, {}, false, {
            P: {};
            B: {};
            D: {};
            C: import("vue").ComputedOptions;
            M: import("vue").MethodOptions;
            Defaults: {};
        } & {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, {}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, {}>) => any) | undefined;
        computed?: any;
        methods?: any;
        watch?: {
            [x: string]: (string | import("vue").WatchCallback<any, any> | ({
                handler: string | import("vue").WatchCallback<any, any>;
            } & import("vue").WatchOptions<boolean>)) | (string | import("vue").WatchCallback<any, any> | ({
                handler: string | import("vue").WatchCallback<any, any>;
            } & import("vue").WatchOptions<boolean>))[];
        } | undefined;
        provide?: import("vue").ComponentProvideOptions | undefined;
        inject?: (string[] | {
            [x: string]: string | symbol | {
                from?: string | symbol | undefined;
                default?: unknown;
            };
            [x: symbol]: string | symbol | {
                from?: string | symbol | undefined;
                default?: unknown;
            };
        }) | undefined;
        filters?: Record<string, Function> | undefined;
        mixins?: any[] | undefined;
        extends?: any;
        beforeCreate?: (() => void) | undefined;
        created?: (() => void) | undefined;
        beforeMount?: (() => void) | undefined;
        mounted?: (() => void) | undefined;
        beforeUpdate?: (() => void) | undefined;
        updated?: (() => void) | undefined;
        activated?: (() => void) | undefined;
        deactivated?: (() => void) | undefined;
        beforeDestroy?: (() => void) | undefined;
        beforeUnmount?: (() => void) | undefined;
        destroyed?: (() => void) | undefined;
        unmounted?: (() => void) | undefined;
        renderTracked?: ((e: import("vue").DebuggerEvent) => void) | undefined;
        renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | undefined;
        errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | undefined;
        delimiters?: [string, string] | undefined;
        __differentiator?: string | number | symbol | undefined;
        __isBuiltIn?: boolean | undefined;
        __file?: string | undefined;
        __name?: string | undefined;
        beforeRouteEnter?: import("vue-router").NavigationGuardWithThis<undefined> | undefined;
        beforeRouteUpdate?: import("vue-router").NavigationGuard | undefined;
        beforeRouteLeave?: import("vue-router").NavigationGuard | undefined;
    }>;
    context: any;
    validate: (options: import("../../interfaces").FieldDefinition, field: string, value: any) => any;
    submit: ($event?: Event | undefined) => Promise<void>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    fields: {
        type: () => AdditionalFields;
        default: () => AdditionalFields;
    };
    responseErrorHandler: {
        type: (...arg: any) => any;
        default: () => () => null;
    };
    timerEnabled: {
        type: () => boolean;
        default: boolean;
    };
}>>, {
    timerEnabled: boolean;
    fields: AdditionalFields;
    responseErrorHandler: any;
}>;
export default _default;
