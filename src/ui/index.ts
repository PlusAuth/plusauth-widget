import { createApp, reactive } from 'vue';

import { installComponents } from './components';
import { i18n } from './directives/i18n';
import { IPlusAuthContext, IWidgetSettings } from './interfaces';
import { Translatable } from './mixins';
import { router } from './utils/router';
import { Theme } from './utils/theme';
import { Translator, translatorKey } from './utils/translator';
import App from './widget';

export function createWidget(container: Element | string,
                             settings: Partial<IWidgetSettings>,
                             context: Partial<IPlusAuthContext>){
  const translator = new Translator(
    settings.locale?.dictionary,
    settings.locale?.defaultLocale
  )
  const theme = new Theme({
    theme: settings.theme
  });
  theme.applyTheme();
  const rSettings = reactive(settings)
  const widget = createApp(App(theme, rSettings));

  widget.directive('t', i18n)
  widget.mixin(Translatable)
  widget.provide(translatorKey, translator)
  widget.use(router)
  widget.provide('context', context)
  widget.config.globalProperties.$i18n = translator
  widget.config.globalProperties.settings = rSettings

  installComponents(widget)

  widget.mount(container)
  return widget;
}
