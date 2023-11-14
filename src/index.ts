import { PlusAuthWeb } from '@plusauth/web';
import deepmerge from 'deepmerge';
import { App, reactive } from 'vue';

import defaultDictionary from './i18n'
import { createTranslator, createWidget } from './ui';
import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
import { createFetchWrapper, FetchWrapper } from './ui/utils/fetch';
import { Translator } from './ui/utils/translator';

export default class PlusAuthWidget {
  private _view: App<Element>;
  public api: PlusAuthWeb;
  public i18n: Translator;
  public http: FetchWrapper;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {

    this.http = createFetchWrapper()
    this.api = new PlusAuthWeb(settings.apiUrl ||
    location.origin !== 'null' ? window.location.origin : '/')

    const reactiveSettings = reactive(deepmerge( {
      locale: {
        defaultLocale: 'en',
        dictionary: defaultDictionary
      }
    }, settings, { clone: true }))

    this.i18n = createTranslator(reactiveSettings.locale)
    this._view = createWidget(container || document.body, reactiveSettings, context, this.i18n)
    this._view.provide('api', this.api)
    this._view.provide('http', this.http)
  }
  get view(): IWidgetSettings {
    // expose settings rather than vue app
    return this._view.config.globalProperties.settings;
  }
}
