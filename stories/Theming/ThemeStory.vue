<script setup lang="ts">
import type { AdditionalFields, IWidgetSettings } from '../../src/ui/interfaces';

import WidgetWrapper from '../WidgetWrapper.vue';

const props = defineProps<IWidgetSettings['theme']>()

</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        clientName: 'TestApp',
        tosUri: 'https://sometosuri.com',
        policyUri: 'https://somepolicyuri.com',
        logoUri: 'https://static.plusauth.com/images/logo.png',
        social: [
          {name: 'google-connection', provider: 'google'},
          {name: 'facebook-connection', provider: 'facebook'},
        ]
      },
      settings: {
        register_enabled: true,
        forgot_password_enabled: true,
        password_policy: {
          min: 4,
          max: 16,
          lower_case: 4
        }
      },
    } as any"
    :settings="{
      theme: props,
      modeOptions: {
        login: {
          fields: {
            password: {
              order: 1,
              errors: ['Password is required']
            },
            otpCode: {
              order: 2,
              type: 'code',
              label: 'OTP'
            },
            accept: {
              order: 3,
              type: 'checkbox',
              label: 'I accept terms and conditions'
            }
          }
        }
      }
    }"
  />
</template>
