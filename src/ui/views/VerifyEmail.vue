<script setup lang="ts">
import { ref, onMounted } from 'vue';

import ResendAction from '../components/ResendAction.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext } from '../composables';
import { resolveLogo } from '../utils';

defineOptions({
  name: 'VerifyEmail'
});

const context = useContext();

const actionCompleted = ref(false);
const time = ref<number>(5);

const error = context.error?.error;
const loginUrl = context.settings.auto_sign_in && context.settings.tenant_login_url;

onMounted(() => {
  if (
    context.prompt?.mode &&
    context.prompt.mode !== 'check' &&
    context.settings?.auto_sign_in &&
    !error
  ) {
    const interval = setInterval(() => {
      if (time.value > 0) {
        time.value--;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      if (context.settings?.tenant_login_url) {
        window.location.replace(context.settings.tenant_login_url);
      }
    }, 5000);
  }
});

const resolveClientLogo = resolveLogo;
</script>

<template>
  <WidgetLayout
    :logo="error ? 'images/icons/email_error.svg' :
      context.prompt?.mode === 'check' || !context.details.email_verified ? 'images/icons/plane.svg'
      : 'images/icons/mail_confirm.svg'
    "
    :title="error ? 'errors.' + error : 'verifyEmail.title'"
    :subtitle="error ? '' : { path: 'verifyEmail.checkText', args: { email: context.details.email } }"
  >
    <template
      v-if="!error && (context.prompt?.mode === 'check' || !context.details.email_verified)"
      #content-footer
    >
      <ResendAction type="common.email" />
    </template>
    <template
      v-else-if="!error"
      #title
    >
      <h1>
        Your email verified successfully.
        <span v-if="loginUrl"> Redirecting to application in {{ time }} seconds.</span>
      </h1>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>