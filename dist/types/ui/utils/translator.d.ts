export declare const translatorKey: unique symbol;
export declare class Translator {
    private fallBackLocale;
    private dictionary;
    private selectedLocale;
    constructor(dictionary: any, fallbackLocale?: string, selectedLocale?: string);
    set locale(locale: string);
    get locale(): string;
    t(key: string, ...values: any): string;
    _interpolate(str: string, args: any, locale: string): string;
}
