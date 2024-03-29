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

  constructor(
    container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>
  ) {

    this.http = createFetchWrapper(settings.apiUrl)

    const { locale: localeSettings, ...otherSettings } = settings

    const reactiveSettings = reactive(
      deepmerge({
        locale: {
          defaultLocale: localeSettings?.defaultLocale || 'en',
          selectedLocale: localeSettings?.selectedLocale || context.params?.ui_locale,
          dictionary: deepmerge(defaultDictionary, localeSettings?.dictionary || {})
        }
      },
      otherSettings,
      { clone: true })
    )

    this.i18n = createTranslator(reactiveSettings.locale)
    this._view = createWidget(container || document.body, reactiveSettings as any, context, {
      i18n: this.i18n,
      http: this.http,
    })
  }
  get view(): IWidgetSettings {
    // expose settings rather than vue app
    return this._view.config.globalProperties.settings;
  }
}
