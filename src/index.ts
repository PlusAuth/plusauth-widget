import deepmerge from 'deepmerge';
import PlusAuth from 'plusauth-web';
import { App } from 'vue';

import defaultDictionary from './i18n'
import { createWidget } from './ui';
import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
// @ts-ignore
import css from './ui/styles/main.sass'

export default class PlusAuthWidget {
  private _view: App<Element>;
  private api: PlusAuth;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {
    this.api = new PlusAuth(settings.apiUrl || window.location.origin)
    this._view = createWidget(container, deepmerge(settings, {
      locale: {
        defaultLocale: 'en',
        dictionary: defaultDictionary
      }
    }), context)
    this._view.provide('api', this.api)
  }
  get view(): IWidgetSettings {
    return this._view.config.globalProperties.settings;
  }
}
