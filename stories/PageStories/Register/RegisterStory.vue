<script setup lang="ts">
import type { AdditionalFields } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = defineProps<{
  fields?: AdditionalFields;
}>()
</script>

<template>
  <WidgetWrapper
    :settings="{ 
      mode: 'register',
      modeOptions: { 
        signup: { 
          fields: props.fields 
        } 
      } 
    }"
  />
</template>