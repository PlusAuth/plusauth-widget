import { createApp, watch } from 'vue';

import { installComponents } from './components';
import { i18n } from './directives/i18n';
import type { IPlusAuthContext, IWidgetSettings } from './interfaces';
import { Theme } from './utils/theme';
import { Translator, translatorKey } from './utils/translator';
import { App } from './widget';

export function createTranslator(settings: IWidgetSettings['locale']) {
  return new Translator(
    settings.dictionary,
    settings.defaultLocale,
    settings.selectedLocale
  )
}

export function createWidget(container: Element | string,
                             settings: IWidgetSettings,
                             context: Partial<IPlusAuthContext>,
                             inject) {
  const theme = new Theme(settings.theme);
  const translator = inject.i18n || createTranslator(settings.locale)
  const widget = createApp(App(theme, settings));

  widget.directive('t', i18n)
  widget.provide(translatorKey,translator )
  widget.provide('http', inject.http)
  widget.provide('context', context)
  widget.provide('settings', settings)
  widget.config.globalProperties.$i18n = inject.i18n
  widget.config.globalProperties.settings = settings

  watch(() => settings.locale.selectedLocale, (locale,) => {
    if (locale) {
      translator.locale = locale
    }
  })

  installComponents(widget)

  widget.mount(container)
  return widget;
}
