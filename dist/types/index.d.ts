import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
export default class PlusAuthWidget {
    private _view;
    private api;
    constructor(container: Element | string, settings: Partial<IWidgetSettings> | undefined, context: Partial<IPlusAuthContext>);
    get view(): IWidgetSettings;
}
