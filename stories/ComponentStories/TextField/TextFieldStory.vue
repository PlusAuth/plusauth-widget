<script setup lang="ts">
import { computed } from 'vue';

import WidgetWrapper from '../../WidgetWrapper.vue';

const props = withDefaults(defineProps<{
  disabled?: boolean;
  label?: string;
  modelValue?: string;
  placeholder?: string;
  type?: string;
}>(), {
  disabled: false,
  label: 'Username',
  modelValue: '',
  placeholder: 'Enter your username',
  type: 'text'
});

const storyFields = computed(() => {
  const targetField = props.type === 'password' ? 'password' : 'username';
  return {
    email: undefined,
    username: targetField === 'username' ? {
      type: props.type,
      label: props.label,
      placeholder: props.placeholder,
      value: props.modelValue,
      attrs: {
        disabled: props.disabled
      }
    } : undefined,
    password: targetField === 'password' ? {
      type: 'password',
      label: props.label,
      placeholder: props.placeholder,
      value: props.modelValue,
      attrs: {
        disabled: props.disabled
      }
    } : undefined
  };
});

</script>

<template>
  <WidgetWrapper
    :settings="{
      modeOptions: {
        login: {
          fields: storyFields
        }
      }
    }"
  />
</template>
