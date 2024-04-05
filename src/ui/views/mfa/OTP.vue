<template>
  <template v-if="context.details.dataUrl">
    <h4>
      1. Download Google Authenticator
      <a
        target="_blank"
        href="https://play.google.com/store/apps/
details?id=com.google.android.apps.authenticator2"
      >
        Android
      </a>
      /
      <a
        href="https://apps.apple.com/us/app/google-authenticator/id388497605"
        target="_blank"
      >iOS</a>
    </h4>
    <p>
      Google Authenticator can be downloaded from the App store or
      Google Play. Search "Google Authenticator"
      and proceed to download.
    </p>
    <h4>2. Add Authentication Token in Google 2FA and keep the key phrase</h4>
    <p>
      Open Google 2FA, scan below QR code or manually enter the key phrase
      to add a token.
      <br>
      Key Phrase is used to recover Google 2FA in the case of phone loss or
      change. Please make sure to keep
      the key phrase; in a safe location before binding.
    </p>
    <div class="pa__logo-container">
      <img
        id="mainLogo"
        class="pa__logo"
        alt="Logo"
        style="max-width: 300px; max-height: 300px;"
        :src="context.details.dataUrl"
      >
    </div>
    <h3
      style="text-align: center;
      background-color: lightgray; border: 1px solid black;"
    >
      {{ context.details.secret }}
    </h3>
    <h4>3. Enable Google Two Factor Authentication</h4>
  </template>
  <template v-else>
    <div class="pa__widget-info-section">
      <p
        v-t="{ path: 'mfa.otp.title'}"
        class="pa__subtitle-2 pa__text-left"
        style="margin: 0 0 12px 0"
      />
    </div>
  </template>
  <GenericForm
    ref="form"
    :fields="fields"
    :validate="validate"
    :submit="submit"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      v-t="'common.submit'"
      block
      color="primary"
      :loading="loading"
      @click="submit"
    />
  </div>

  <div
    v-if="context.details.challenges.length > 1"
    class="pa__widget-helpers-section"
  >
    <a
      v-t="'mfa.tryAnotherWay'"
      href="/signin/challenge"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'OTP',
  components: {  GenericForm },
  setup(){

    const http = useHttp()
    const context = useContext()

    const code = ref<string>(null as any)
    const error = ref<string>(null as any)

    const defaultFields: AdditionalFields = {
      code: {
        type: 'code',
        value: null,
      }
    }
    const { form, loading, submit, fields, validate } = useGenericForm(
      'otpMfa',
      defaultFields,
      async (values) => {
        await http.post({
          body: values
        })
      }
    )
    return {
      fields,
      validate,
      code,
      context,
      error,
      form,
      loading,
      submit
    }
  }
})
</script>

<style scoped>

</style>
