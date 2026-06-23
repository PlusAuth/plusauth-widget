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
      details: {
        fields: [
          'username',
          {
            name: 'phone_number',
            type: 'text'
          }
        ]
      },
      ...props.context
    } as any"
    :settings="{ mode: 'fill-missing' }"
  />
</template>
