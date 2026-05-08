<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';
</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        logoUri: 'https://static.plusauth.com/images/logo.png',
        social: [
          {
            name: 'google',
            provider: 'google',
            branding: {
              display_name: 'Google',
              show_in_login: true
            }
          },
          {
            name: 'github',
            provider: 'github',
            branding: {
              display_name: 'GitHub',
              show_in_login: true
            }
          }
        ]
      }
    } as any"
    :settings="{ mode: 'login' }"
  />
</template>
