<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';
</script>

<template>
  <WidgetWrapper
    :settings="{
      mode: 'login',
      modeOptions: {
        login: {
          fields: {
            email: {
              value: 'demo@plusauth.com',
              required: false
            },
            password: {
              value: 'Password1!',
              required: false
            }
          },
          preAction() {
            throw { error: 'demo_alert' }
          },
          responseErrorHandler(_error, formRef) {
            formRef.toggleAlert('This is a demo alert message')
          }
        }
      }
    }"
  />
</template>
