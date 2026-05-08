<script setup lang="ts">
import type { AdditionalFields, IPlusAuthContext } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = defineProps<{
  fields?: AdditionalFields;
  context?: Partial<IPlusAuthContext>;
}>();
</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        logoUri: 'https://static.plusauth.com/images/logo.png',
        ...props.context?.client
      },
      settings: {
        password_policy: {
          min: 8,
          upper_case: 1,
          lower_case: 1,
          number: 1
        },
        ...props.context?.settings
      },
      ...props.context
    } as any"
    :settings="{
      mode: 'reset-password',
      modeOptions: {
        resetPassword: {
          fields: props.fields
        }
      }
    }"
  />
</template>
