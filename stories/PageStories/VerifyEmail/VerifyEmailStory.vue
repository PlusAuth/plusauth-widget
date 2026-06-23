<script setup lang="ts">
import type { IPlusAuthContext } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = defineProps<{
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
        auto_sign_in: false,
        tenant_login_url: 'https://app.example.com/login',
        ...props.context?.settings
      },
      prompt: {
        name: 'verify_email',
        mode: 'check'
      },
      details: {
        email: 'john@example.com',
        email_verified: false
      },
      ...props.context
    } as any"
    :settings="{ mode: 'verify-email' }"
  />
</template>
