import { createApp, watch } from 'vue';

import { installComponents } from './components';
import { i18n } from './directives/i18n';
import { IPlusAuthContext, IWidgetSettings } from './interfaces';
import { Translatable } from './mixins';
import { router } from './utils/router';
import { Theme } from './utils/theme';
import { Translator, translatorKey } from './utils/translator';
import App from './widget';

export function createTranslator(settings: IWidgetSettings['locale']){
  return  new Translator(
    settings.dictionary,
    settings.defaultLocale,
    settings.selectedLocale
  )
}
export function createWidget(container: Element | string,
                             settings: IWidgetSettings,
                             context: Partial<IPlusAuthContext>,
                             translator = createTranslator(settings.locale)){
  const theme = new Theme({
    theme: settings.theme
  });

  theme.applyTheme();

  const widget = createApp(App(theme, settings));

  widget.directive('t', i18n)
  widget.mixin(Translatable)
  widget.provide(translatorKey, translator)
  widget.use(router(settings))
  widget.provide('context', context)
  widget.config.globalProperties.$i18n = translator
  widget.config.globalProperties.settings = settings

  watch(() => settings.locale.selectedLocale, (locale,) => {
    if(locale){
      translator.locale = locale
    }
  })

  installComponents(widget)

  widget.mount(container)
  return widget;
}
