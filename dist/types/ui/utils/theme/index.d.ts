export declare class Theme {
    static property: string;
    disabled: boolean;
    options: any;
    styleEl?: HTMLStyleElement;
    theme: any;
    defaults: any;
    constructor(options: any);
    set css(val: string);
    applyTheme(): void;
    clearCss(): void;
    init(): void;
    setTheme(value: any): void;
    resetThemes(): void;
    private checkOrCreateStyleElement;
    private genStyleElement;
    private initTheme;
    get currentTheme(): any;
    get generatedStyles(): string;
    get parsedTheme(): any;
}
