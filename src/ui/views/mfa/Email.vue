<template>
  <p-form class="text-center">
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="logo"
      alt="Logo"
      src="/images/icons/email_question.svg"
    >
    <div class="subtitle-2 text-left">
      Enter verification code sent to:
      <strong>{{ context.details.email }}</strong>
    </div>
  </p-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Email'
})
</script >

<style scoped >

</style >
