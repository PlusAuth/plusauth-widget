import { ComponentPublicInstance } from 'vue';
import { IClient } from '../interfaces';
export declare function convertToUnit(str: string | number | null | undefined, unit?: string): string | undefined;
export declare function setBackgroundColor(this: ComponentPublicInstance, color?: string | false, data?: any): any;
export declare function propertyAccessor(object: Record<string, any>, keys: string | null, array?: any[] | any): string | undefined;
export declare function isPlainObject(obj: any): boolean;
export declare function isObject(obj: any): boolean;
export declare function parseArgs(...args: Array<any>): {
    locale?: string | null;
    params: any;
};
export declare function looseEqual(a: any, b: any): boolean;
export declare function resolveClientLogo(client: IClient): string;
export declare function keysToDotNotation(obj: Record<string, any>, current?: string, final?: Record<string, any>): Record<string, any>;
export declare function escapeRegExp(string: string): string;
export declare function isEmail(value: string): boolean;
export declare function isPhone(value: string): boolean;
