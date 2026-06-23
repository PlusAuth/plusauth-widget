import { createApp, watch } from 'vue';

import { installComponents } from './components';
import { i18n } from './directives/i18n';
import type { IPlusAuthContext, IWidgetSettings } from './interfaces';
import { Theme } from './utils/theme';
import { Translator, translatorKey } from './utils/translator';
import { App } from './widget';
import 'virtual:uno.css';

export function createWidget(
  container: Element | string,
  settings: IWidgetSettings,
  context: Partial<IPlusAuthContext>,
  inject
) {
  const theme = new Theme(settings.theme);
  const translator = inject.i18n || new Translator(settings.locale);
  const widget = createApp(App(theme, settings));

  widget.directive('t', i18n);
  widget.provide(translatorKey, translator);
  widget.provide('http', inject.http);
  widget.provide('context', context);
  widget.provide('settings', settings);
  widget.config.globalProperties.$i18n = inject.i18n;
  widget.config.globalProperties.settings = settings;

  installComponents(widget);

  const targetElement =
    typeof container === 'string' ? document.querySelector(container)! : container;
  const templates = {} as Record<string, Element>;
  const templateSelector = 'template[id^="pa-"], pa-template[id^="pa-"]';

  const registerTemplate = (temp: Element) => {
    const key = temp.id.replace(/^pa-/, '');
    if (!key || templates[key]) return;
    templates[key] = temp.cloneNode(true) as Element;
  };

  document.querySelectorAll(templateSelector).forEach(registerTemplate);

  widget.provide('templates', templates);

  widget.mount(targetElement);

  const onDemoStateMessage = (event) => {
    if (event.data.type === 'SET_DEMO_STATES') {
      const { hover, focus } = event.data.payload;
      const all = targetElement.querySelectorAll('*');
      all.forEach((el) => {
        el.classList.toggle('pa__hover--demo', !!hover);
        el.classList.toggle('pa__focus--demo', !!focus);
      });
    }
  };

  window.addEventListener('message', onDemoStateMessage);

  const originalUnmount = widget.unmount.bind(widget);
  widget.unmount = (...args) => {
    window.removeEventListener('message', onDemoStateMessage);
    return originalUnmount(...args);
  };

  watch(
    translator.localeRef,
    (locale) => {
      if (locale !== translator.locale) {
        translator.locale = locale;
      }
      if (locale) {
        document.querySelectorAll('[data-t]').forEach((el) => {
          el.textContent = translator.t((el as HTMLElement).dataset.t);
        });
      }
    },
    { immediate: true, flush: 'post' }
  );

  return widget;
}
