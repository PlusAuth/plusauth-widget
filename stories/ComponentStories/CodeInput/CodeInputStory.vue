<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = withDefaults(defineProps<{
  label?: string;
  modelValue?: string;
  size?: number;
}>(), {
  label: 'Verification Code',
  modelValue: '',
  size: 6
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
            otp_code: {
              type: 'code',
              label,
              value: modelValue,
              length: size
            }
          }
        }
      }
    }"
  />
</template>
