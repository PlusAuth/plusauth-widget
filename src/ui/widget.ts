import { h, ref, onBeforeUnmount, inject, computed } from 'vue';
import './styles/main.css'

import PFooter from './components/Footer.vue';
import type { IWidgetSettings } from './interfaces';
import { resolveView } from './utils/router';
import type { Theme } from './utils/theme';
import type { Translator } from './utils/translator';
import { translatorKey } from './utils/translator';

export function App(theme: Theme, settings: Partial<IWidgetSettings>): any {
  return {
    provide: {
      theme
    },
    setup(){
      const isMobile = ref(false)
      const i18n = inject(translatorKey) as Translator
      function onResize() {
        isMobile.value = window.innerWidth < 600
      }
      window.addEventListener('resize', onResize, { passive: true })
      onResize()

      onBeforeUnmount(() => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', onResize)
        }
      })

      return {
        resolvedView: computed(() => resolveView(settings.mode)) ,
        isMobile,
        locale: i18n.localeRef
      }
    },
    render(){
      return h(
        'div',
        {
          class: 'pa__widget',
          key: this.locale
        },
        h('div', { class: 'pa__widget-content' },
          [
            h(
              'div',
              {
                class: ['pa__widget-content-main']
              },
              [
                this.resolvedView && h(
                  this.resolvedView
                )
              ]
            ),
            settings.footer && settings.footer.enabled && h(PFooter as any,
              { class: 'pa__widget-footer' })
          ] )

      )
    }
  };
}

