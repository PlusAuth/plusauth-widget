<script setup lang="ts">
import type { AdditionalFields } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

const props = defineProps<{
  fields?: AdditionalFields;
  context?: any;
}>()
</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        logoUri: 'https://static.plusauth.com/images/logo.png',
        ...props.context?.client
      },
      settings: {
        register_enabled: true,
        forgot_password_enabled: true
      },
      ...props.context
    } as any"
    :settings="{ 
      modeOptions: { 
        login: { 
          fields: props.fields 
        } 
      } 
    }"
  />
</template>