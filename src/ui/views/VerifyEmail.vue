<template>
  <WidgetLayout
    :logo="error ? 'images/icons/email_error.svg' :
      context.prompt?.mode === 'check' || !context.details.email_verified ? 'images/icons/plane.svg'
      : 'images/icons/mail_confirm.svg'
    "
    :title="error ? 'errors.'+error: 'verifyEmail.title'"
    :subtitle="error ? '' : {path: 'verifyEmail.checkText', args: { email: context.details.email}}"
  >
    <template
      v-if="!error && (context.prompt?.mode === 'check' || !context.details.email_verified)"
      #content-footer
    >
      <p>
        <span
          v-t="[ 'common.resendText', { type: 'common.email' } ]"
          style="padding-right: 4px"
        /><a
          v-t="'common.resend'"
          :href="resendLink"
        />
      </p>
    </template>
    <template
      v-else-if="!error"
      #title
    >
      <h1>
        Your email verified successfully.
        <span v-if="loginUrl">  Redirecting to application in {{ time }} seconds.</span>
      </h1>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted
} from 'vue';

import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext } from '../composables';
import { resolveLogo } from '../utils';

export default defineComponent({
  name: 'VerifyEmail',
  components: { WidgetLayout },

  setup() {
    const context = useContext()

    const actionCompleted = ref(false)
    let time = ref<number>(5);

    const error = context.error?.error
    let loginUrl = context.settings.auto_sign_in && context.settings.tenant_login_url

    const resendLink = `${window.location.pathname}/resend`

    onMounted(() => {
      if (
        context.prompt?.mode
        && context.prompt.mode !== 'check'
        && context.settings?.auto_sign_in && !error
      ) {
        setInterval(() => {
          time.value && time.value--;
        }, 1000)
        setTimeout(() => {
          if (context.settings?.tenant_login_url) {
            window.location.replace(context.settings.tenant_login_url)
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
      resolveClientLogo: resolveLogo
    }
  },
})
</script>

<style scoped>

</style>
