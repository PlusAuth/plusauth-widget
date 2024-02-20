<script setup lang="ts">
import type { AdditionalFields } from '../src/ui/interfaces';

import WidgetWrapper from './WidgetWrapper.vue';

const props = defineProps<{
  /**
   * See {@link "/?path=/docs/custom-fields--documentation"}
   */
  fields: AdditionalFields
}>()

</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        logoUri: ''
      }
    } as any"
    :settings="{ modeOptions: { login: { fields }}}"
  />
</template>
