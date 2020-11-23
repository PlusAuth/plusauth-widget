<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div class="row ">
      <template v-if="error === 'incorrect_code'">
        <div class="col-12 title text-center">
          <img
            src="https://api.plusauth.com/assets/images/icons/email_error.svg"
            style="width: 128px; "
            alt="Mail Confirmation"
          >
        </div>
        <div class="col col-12 text-center">
          Incorrect verification code received.
        </div>
      </template>
      <template v-else>
        <div
          class="col col-12 align-center text-center"
        >
          <img
            src="https://api.plusauth.com/assets/images/icons/mail_confirm.svg"
            style="width: 128px; "
            alt="Mail Confirmation"
          >
        </div>
        <div class="col col-12 text-center">
          Your email verified successfully.
          <span v-if="loginUrl">  Redirecting to application in {{ time }} seconds.</span>
        </div>
      </template>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent,
  inject, ref, onMounted } from 'vue';


import { AdditionalFields } from '../interfaces';
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
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({})
    },
  },
  setup(){
    const context = inject('context') as any
    const actionCompleted = ref(false)
    const error  = context.error?.error
    let loginUrl = context.details?.tenantLoginUrl
    let time = ref<number>(5);

    onMounted(() => {
      if(context.autoSignIn){
        setInterval(()=>{
          time.value--;
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
