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
      />
    </template>

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

<script lang="ts">
import { defineComponent, inject } from 'vue';

import type { IPlusAuthContext } from '../interfaces';
import type { Translator } from '../utils/translator';
import { translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'PFooter',
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
  setup(){
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator
    const client = context.client
    return {
      translator,
      languages: Object.values(translator.locales || []),
      tosUri: client.tosUri,
      policyUri: client.policyUri,
    }
  }
})
</script>

<style scoped>

</style>
