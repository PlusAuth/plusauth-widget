import { createApp, watch } from 'vue';

import { installComponents } from './components';
import { i18n } from './directives/i18n';
import type { IPlusAuthContext, IWidgetSettings } from './interfaces';
import { Theme } from './utils/theme';
import { Translator, translatorKey } from './utils/translator';
import { App } from './widget';

export function createWidget(container: Element | string,
                             settings: IWidgetSettings,
                             context: Partial<IPlusAuthContext>,
                             inject) {
  const theme = new Theme(settings.theme);
  const translator = inject.i18n || new Translator(settings.locale)
  const widget = createApp(App(theme, settings));

  widget.directive('t', i18n)
  widget.provide(translatorKey,translator )
  widget.provide('http', inject.http)
  widget.provide('context', context)
  widget.provide('settings', settings)
  widget.config.globalProperties.$i18n = inject.i18n
  widget.config.globalProperties.settings = settings

  installComponents(widget)

  container = typeof container === 'string' ? document.querySelector(container)! : container
  const templates = {} as Record<string, Node>
  container.querySelectorAll('template, pa-template').forEach(temp => {
    if(temp.id && temp.id.startsWith('pa-')){
      templates[temp.id.replace(/^pa-/, '')] = temp.cloneNode(true)
    }
  })
  widget.provide('templates', templates)
  widget.mount(container)

  watch(translator.localeRef, (locale) => {
    if(locale !== translator.locale ){
      translator.locale = locale
    }
    if (locale) {
      document.querySelectorAll('[data-t]').forEach((el) => {
        el.textContent = translator.t((el as HTMLElement).dataset.t)
      });
    }
  }, { immediate: true, flush: 'post' })

  return widget;
}
