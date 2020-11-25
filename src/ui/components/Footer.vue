<template>
  <footer>
    <template v-if="languages && languages.length">
      <PSelect
        v-model="selectedLang"
        flat
        dense
        hide-messages
        :items="languages"
      />
    </template>

    <ul class="pa__widget-content-footer-link-list">
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
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'Footer',
  props: {
    termsOfService: {
      type: String as () => string,
      default: null
    },
    privacyPolicy: {
      type: String as () => string,
      default: null
    },
    languages: {
      type: Array as () => string[],
      default: [{ name: 'Turkce', value: 'tr' }]
    }
  },
  setup(){
    const context = inject('context') as any
    const client = context.client
    const selectedLang = ref<string>('tr')
    return {
      selectedLang,
      tosUri: client.tosUri,
      policyUri: client.policyUri
    }
  }
})
</script>

<style scoped>

</style>
