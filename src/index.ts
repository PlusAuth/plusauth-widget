import deepmerge from 'deepmerge';
import type { App } from 'vue';
import { reactive } from 'vue';

import defaultDictionary from './i18n'
import { createTranslator, createWidget } from './ui';
import type { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
import type { FetchWrapper } from './ui/utils/fetch';
import { createFetchWrapper } from './ui/utils/fetch';
import type { Translator } from './ui/utils/translator';

export default class PlusAuthWidget {
  private _view: App<Element>;
  public i18n: Translator;
  public http: FetchWrapper;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {

    this.http = createFetchWrapper(settings.apiUrl)

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
