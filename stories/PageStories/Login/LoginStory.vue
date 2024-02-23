<script setup lang="ts">
import type { AdditionalFields } from '../../../src/ui/interfaces';

import WidgetWrapper from '../../WidgetWrapper.vue';

const props = defineProps<{
  /**
   * See [Custom Fields](/?path=/docs/custom-fields--01-documentation)
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
