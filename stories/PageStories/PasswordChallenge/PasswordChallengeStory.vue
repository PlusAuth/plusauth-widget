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
        forgot_password_enabled: true,
        ...props.context?.settings
      },
      details: {
        email: 'john@example.com',
        identifier: 'email',
        ...props.context?.details
      },
      ...props.context
    } as any"
    :settings="{
      mode: 'password-challenge',
      modeOptions: {
        passwordChallenge: {
          fields: props.fields
        }
      }
    }"
  />
</template>
