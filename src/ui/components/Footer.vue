<template>
  <footer>
    <template v-if="languages && languages.length">
      <PSelect
        v-model="translator.locale"
        flat
        label="Language"
        style="width: auto; margin: 0"
        dense
        hide-messages
        :items="languages"
      />
    </template>

    <ul class="pa__widget-footer-link-list">
      <li
        v-if="tosUri"
      >
        <a
          :href="tosUri"
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
          referrerpolicy="no-referrer"
        >Privacy Policy</a>
      </li>
    </ul>
  </footer>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

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
    const context = inject('context') as any
    const translator = inject(translatorKey) as any
    const client = context.client
    const languages = reactive(context.ui_locales || [])
    return {
      translator,
      languages,
      tosUri: client.tosUri,
      policyUri: client.policyUri,
    }
  }
})
</script>

<style scoped>

</style>
