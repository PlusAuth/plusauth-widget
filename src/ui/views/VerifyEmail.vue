<template>
  <template v-if="error">
    <div class="pa__logo-container">
      <img
        src="https://api.plusauth.com/assets/images/icons/email_error.svg"
        class="pa__logo"
        alt="Mail Confirmation"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1 v-t="'errors.'+error" />
    </div>
  </template>
  <template v-else-if="context.prompt?.mode === 'check' || !context.details.email_verified">
    <div class="pa__logo-container">
      <img
        src="https://api.plusauth.com/assets/images/icons/plane.svg"
        class="pa__logo"
        alt="Mail Confirmation"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1 v-t="'verifyEmail.title'" />
      <h2 v-t="{path: 'verifyEmail.checkText', args: { email: context.details.email}}" />
    </div>
    <div class="pa__widget-content-footer">
      <p align="center">
        <span
          v-t="'verifyEmail.resendText'"
          style="padding-right: 4px"
        /><a
          v-t="'verifyEmail.resendAction'"
          :href="resendLink"
        />
      </p>
    </div>
  </template>
  <template v-else>
    <div class="pa__logo-container">
      <img
        src="https://api.plusauth.com/assets/images/icons/mail_confirm.svg"
        class="pa__logo"
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
import { parseQueryUrl } from '../utils/url';

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
    const queryParams = parseQueryUrl(window.location.search)
    const resendLink = `${window.location.pathname  }/resend`
    onMounted(() => {
      if(context.prompt?.mode && context.prompt.mode !== 'check' && context.autoSignIn && !error){
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
      resendLink,
      resolveClientLogo,
      queryParams
    }
  },
})
</script >

<style scoped >

</style >
