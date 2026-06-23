<script setup lang="ts">
import type { IPlusAuthContext } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        clientName: 'PlusAuth',
        logoUri: 'https://static.plusauth.com/images/logo.png',
      },
      details: {
        requested: {
          base: ['openid', 'offline_access'],
          claims: ['email', 'profile'],
          resources: {
            'Calendar API': ['read:events', 'write:events']
          }
        }
      },
    } as any"
    :settings="{ mode: 'consent' }"
  />
</template>
