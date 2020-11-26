<template>
  <template v-if="error === 'incorrect_code'">
    <div class="pa__logo-container">
      <img
        src="https://api.plusauth.com/assets/images/icons/email_error.svg"
        style="width: 128px; "
        alt="Mail Confirmation"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1>
        Incorrect verification code received.
      </h1>
    </div>
  </template>
  <template v-else>
    <div class="pa__logo-container">
      <img
        src="https://api.plusauth.com/assets/images/icons/mail_confirm.svg"
        style="width: 128px; "
        alt="Mail Confirmation"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1>
        Your email verified successfully.
        <span v-if="loginUrl">  Redirecting to application in {{ time }} seconds.</span>
      </h1>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent,
  inject, ref, onMounted } from 'vue';

import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'VerifyEmail',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    },
  },
  setup(){
    const context = inject('context') as any
    const actionCompleted = ref(false)
    const error  = context.error?.error
    let loginUrl = context.autoSignIn && context.details?.tenantLoginUrl
    let time = ref<number>(5);

    onMounted(() => {
      if(context.autoSignIn){
        setInterval(()=>{
          time.value && time.value--;
        }, 1000)
        setTimeout(()=>{
          if(loginUrl){
            window.location.replace(loginUrl)
          }
        }, 5000)
      }
    })
    return {
      time,
      context,
      actionCompleted,
      error,
      loginUrl,
      resolveClientLogo,
    }
  },
})
</script >

<style scoped >

</style >
