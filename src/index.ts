import deepmerge from 'deepmerge';
import PlusAuth from 'plusauth-web';
import { App } from 'vue';

import defaultDictionary from './i18n'
import { createWidget } from './ui';
import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';

export default class PlusAuthWidget {
  private _view: App<Element>;
  private api: PlusAuth;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {

    this.api = new PlusAuth(settings.apiUrl ||
    location.origin !== 'null' ? window.location.origin : '/')

    this._view = createWidget(container || document.body, deepmerge(settings, {
      locale: {
        defaultLocale: 'en',
        dictionary: defaultDictionary
      }
    }), context)

    this._view.provide('api', this.api)
  }
  get view(): IWidgetSettings {
    // expose settings rather than vue app
    return this._view.config.globalProperties.settings;
  }
}
