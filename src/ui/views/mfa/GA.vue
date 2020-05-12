<template>
  <p-form
    ref="form"
    autocomplete="off"
    @submit="submit"
  >
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
      <div class="text-center">
        <img
          id="mainLogo"
          class="logo"
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
    <PCodeInput
      v-model="code"
      color="primary"
    />
    <p-message
      :value="error"
      color="error"
      class="mb-4"
    />

    <p-btn
      type="submit"
      block
      color="primary"
      :loading="loading"
    >
      <span v-t="'mfa.sms.submit'" />
    </p-btn>
    <div
      v-if="context.details.challenges.length > 1"
      class="row justify-center "
    >
      <a
        v-t="'mfa.tryAnotherWay'"
        href="/signin/challenge"
      />
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-web';
import { inject, ref } from 'vue';

import { PForm } from '../../components';
import PCodeInput from '../../components/PCodeInput';
export default {
  name: 'GA',
  components: { PCodeInput },
  setup(){
    const api = inject('api') as PlusAuth
    const code = ref<string>(null as any)
    const error = ref<string>(null as any)
    const form = ref<InstanceType<typeof PForm>>(null as any)
    const loading = ref<boolean>(false)

    return {
      code,
      error,
      form,
      loading,
      async submit($event: Event){
        $event.preventDefault()

        loading.value = true

        const valid = form.value?.validate()
        if(valid){
          form.value?.resetValidation()
          try{
            await api.mfa.validateCode(
              code.value as string,
              'ga'
            )
          }catch (e) {
            error.value = e.error;
          }finally {
            loading.value = false
          }
          return false
        }else{
          loading.value = false
        }
      }
    }
  }
}
</script >

<style scoped >

</style >
