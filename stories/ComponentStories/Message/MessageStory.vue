<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';
</script>

<template>
  <WidgetWrapper
    :settings="{
      modeOptions: {
        login: {
          fields: {
            email: undefined,
            username: {
              type: 'text',
              label: 'Username',
              errors: 'This is a demo validation message'
            },
            password: undefined
          }
        }
      }
    }"
  />
</template>
