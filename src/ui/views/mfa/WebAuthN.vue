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
        :fields="finalFields"
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

import { defineComponent, inject, onMounted, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import type { AdditionalFields, IPlusAuthContext, IWidgetSettings } from '../../interfaces';
import type { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'WebAuthN',
  components: { GenericForm },
  setup() {
    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator
    const settings = inject('settings') as Partial<IWidgetSettings>

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
    const { form, loading, submit, fields: finalFields, validate } = form_generics.call(
      (settings.modeOptions || {}).webauthnMfa,
      defaultFields,
      async (values) => {
        try {
          await http.post({ body: values })
        } catch (e) {
          if (e.error) {
            form.value.toggleAlert(`errors.${e.error}`, {
              dismissible: false
            })
          }
          throw e
        }
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
            finalFields.response.value = await verifyDevice(context.details.authentication_options)
          } else if (context.details.registration_options) {
            loadingMsg.value = 'Registration a security key/device'
            finalFields.response.value = await registerDevice(context.details.registration_options)
          } else {
            throw new Error('WebAuthN options not found')
          }
        } catch (e) {
          if (e.error || e.message) {
            form.value.toggleAlert(`${translator.t('errors.webauthn.operation_failed')}<br>
<strong>${e.error || e.message}</strong>`, {
              dismissible: false
            })
          }
          loading.value = false;
          throw e
        }
        loadingMsg.value = translator.t('mfa.webauthn.verifying')
        await submit()
      }

    })
    return {
      finalFields,
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
