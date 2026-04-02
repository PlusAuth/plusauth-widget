
<script lang="ts">
/* eslint-disable @style/max-len */
import { defineComponent, inject } from 'vue';

import type { IPlusAuthContext } from '../interfaces';
import type { Translator } from '../utils/translator';
import { translatorKey } from '../utils/translator';

import WidgetTemplate from './WidgetTemplate.tsx';

export default defineComponent({
  name: 'PFooter',
  components: { WidgetTemplate },
  props: {
    termsOfService: {
      type: String as () => string,
      default: null
    },
    privacyPolicy: {
      type: String as () => string,
      default: null
    },
  },
  setup() {
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator
    const client = context.client || {}
    return {
      translator,
      languages: Object.values(translator.locales || []),
      tosUri: client.tosUri,
      policyUri: client.policyUri,
    }
  }
})
</script>
<template>
  <footer>
    <template v-if="languages && languages.length > 1">
      <PSelect
        v-model="translator.locale"
        flat
        label="Language"
        style="width: auto; margin: 0"
        dense
        hide-messages
        item-text="label"
        :items="languages"
      >
        <template #prepend>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 256 256"
            style="margin: auto 0"
          >
            <path
              fill="currentColor"
              d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24m87.62 96h-39.83c-1.79-36.51-15.85-62.33-27.38-77.6a88.19 88.19 0 0 1 67.22 77.6ZM96.23 136h63.54c-2.31 41.61-22.23 67.11-31.77 77c-9.55-9.9-29.46-35.4-31.77-77m0-16c2.31-41.61 22.23-67.11 31.77-77c9.55 9.93 29.46 35.43 31.77 77Zm11.36-77.6C96.06 57.67 82 83.49 80.21 120H40.37a88.19 88.19 0 0 1 67.22-77.6M40.37 136h39.84c1.82 36.51 15.85 62.33 27.38 77.6A88.19 88.19 0 0 1 40.37 136m108 77.6c11.53-15.27 25.56-41.09 27.38-77.6h39.84a88.19 88.19 0 0 1-67.18 77.6Z"
            />
          </svg>
        </template>
      </PSelect>
    </template>
    <WidgetTemplate name="footer-body" />
    <ul class="pa__widget-footer-link-list">
      <li
        v-if="tosUri"
      >
        <a
          :href="tosUri"
          tabindex="0"
          target="_blank"
          referrerpolicy="no-referrer"
        >Terms of Service</a>
      </li>
      <li
        v-if="policyUri"
      >
        <a
          :href="policyUri"
          target="_blank"
          tabindex="0"
          referrerpolicy="no-referrer"
        >Privacy Policy</a>
      </li>
    </ul>
  </footer>
</template>

<style scoped>

</style>
