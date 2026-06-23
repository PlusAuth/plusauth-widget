<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = withDefaults(defineProps<{
  label?: string;
  modelValue?: boolean;
}>(), {
  label: 'I accept the terms',
  modelValue: false
});

</script>

<template>
  <WidgetWrapper
    :settings="{
      modeOptions: {
        login: {
          fields: {
            email: undefined,
            username: undefined,
            password: undefined,
            accept_terms: {
              type: 'checkbox',
              label,
              value: modelValue
            }
          }
        }
      }
    }"
  />
</template>
