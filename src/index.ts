import type { App } from 'vue';
import { reactive } from 'vue';

import { createWidget } from './ui';
import type { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
import type { FetchWrapper } from './ui/utils/fetch';
import { createFetchWrapper } from './ui/utils/fetch';
import { Translator } from './ui/utils/translator';

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

    const reactiveSettings = reactive(settings)

    this.i18n = new Translator(reactiveSettings.locale)
    if(context.params?.ui_locales){
      const userPreferredLocales = context.params?.ui_locales?.split(' ') || []
      for (let contextLocale of userPreferredLocales) {
        if(this.i18n.locales[contextLocale]){
          this.i18n.locale = contextLocale
          break;
        }
      }
    }
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
