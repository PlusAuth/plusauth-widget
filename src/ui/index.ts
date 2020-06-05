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
    light: true
  });
  theme.applyTheme();

  const widget = createApp(App(theme));

  widget.directive('t', i18n)
  widget.mixin(Translatable)
  widget.provide(translatorKey, translator)
  widget.use(router)
  widget.provide('context', context)
  widget.config.globalProperties.$i18n = translator
  widget.config.globalProperties.settings = reactive(settings)

  installComponents(widget)

  widget.mount(container)
  return widget;
}
