<template>
  <div style="position: relative">
    <div class="pa__widget-info-section">
      <div
        v-if="loading"
        style="position:absolute; top: 0; bottom: 0; right: 0; display: flex;
       align-items: center; flex-direction: column; left: 0; justify-content: center;
        background: white; opacity: 1;"
      >
        <p-spinner
          color="primary"
          indeterminate
        />
        <div
          v-if="loadingMsg"
          v-t="loadingMsg"
          style="margin-top: 12px; font-size: 0.9em"
        />
      </div>
      <GenericForm
        ref="form"
        :fields="fields"
        :validate="validate"
        :submit="submit"
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
  </div>
</template>

<script lang="ts">
import {
  startAuthentication as verifyDevice,
  startRegistration as registerDevice,
  browserSupportsWebAuthn as isWebAuthNSupported
} from '@simplewebauthn/browser';

import { defineComponent, onMounted, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'WebAuthN',
  components: { GenericForm },
  setup() {
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const code = ref<string>(null as any)
    const error = ref<string>(null as any)
    const loadingMsg = ref<string | null>(null as any)

    const defaultFields: AdditionalFields = {
      response: {
        type: 'text',
        visible: false,
        value: null,
      }
    }
    const { form, loading, submit, fields, validate } = useGenericForm(
      'webauthnMfa',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
      }
    )

    onMounted(async () => {
      loading.value = true;
      if (!isWebAuthNSupported()) {
        form.value.toggleAlert('errors.webauthn.not_supported', {
          dismissible: false
        })
        loading.value = false;
      } else {
        try {
          if (context.details.authentication_options) {
            loadingMsg.value = 'Select one of your security key/devices'
            fields.response!.value = await verifyDevice(context.details.authentication_options)
          } else if (context.details.registration_options) {
            loadingMsg.value = 'Registration a security key/device'
            fields.response!.value = await registerDevice(context.details.registration_options)
          } else {
            throw new Error('WebAuthN options not found')
          }
        } catch (e) {
          if (e.error || e.message) {
            form.value.toggleAlert(`${i18n.t('errors.webauthn.operation_failed')}<br>
<strong>${e.error || e.message}</strong>`)
          }
          loading.value = false;
          throw e
        }
        loadingMsg.value = i18n.t('mfa.webauthn.verifying')
        await submit()
      }

    })
    return {
      fields,
      validate,
      code,
      context,
      error,
      form,
      loading,
      loadingMsg,
      submit
    }
  }
})
</script>

<style scoped>

</style>
