import { AdditionalFields } from '../interfaces';
export declare const CustomizableFormProps: {
    fields: {
        type: () => AdditionalFields;
        default: () => AdditionalFields;
    };
    responseErrorHandler: {
        type: (...arg: any) => any;
        default: () => () => null;
    };
};
