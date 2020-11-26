import { PlusAuthWeb } from '@plusauth/web';
import deepmerge from 'deepmerge';
import { App } from 'vue';

import defaultDictionary from './i18n'
import { createWidget } from './ui';
import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';

export default class PlusAuthWidget {
  private _view: App<Element>;
  private api: PlusAuthWeb;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {

    this.api = new PlusAuthWeb(settings.apiUrl ||
    location.origin !== 'null' ? window.location.origin : '/')

    this._view = createWidget(container || document.body, deepmerge( {
      locale: {
        defaultLocale: 'en',
        dictionary: defaultDictionary
      }
    }, settings), context)

    this._view.provide('api', this.api)
  }
  get view(): IWidgetSettings {
    // expose settings rather than vue app
    return this._view.config.globalProperties.settings;
  }
}
