<script setup lang="ts">
import type { AdditionalFields, IPlusAuthContext } from '../../../src/ui/interfaces';
import WidgetWrapper from '../../WidgetWrapper.vue';

</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        logoUri: 'https://static.plusauth.com/images/logo.png',
      },
      details: {
        merge_context: {
          type: 'password'
        },
        merge_with: {
          email: 'john@personal.example',
          profile: {
            first_name: 'John',
            last_name: 'Doe'
          }
        },
        user: {
          email: 'john@work.example',
          profile: {
            first_name: 'John',
            last_name: 'Doe'
          }
        },
      },
    } as any"
    :settings="{
      mode: 'account-linking',
      modeOptions: {
        accountLinking: {
        }
      }
    }"
  />
</template>
