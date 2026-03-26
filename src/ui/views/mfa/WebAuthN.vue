<template>
  <WidgetLayout
    logo="images/icons/pass_credential.svg"
    logo-style="height: 96px;"
    subtitle="mfa.webauthn.title"
  >
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        block
        v-if="supported"
        color="primary"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p
        v-if="context.details.challenges.length > 1"
      >
        <a
          v-t="'mfa.tryAnotherWay'"
          href="signin/challenge"
        />
      </p>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import {
  startAuthentication as verifyDevice,
  startRegistration as registerDevice,
  browserSupportsWebAuthn as isWebAuthNSupported
} from '@simplewebauthn/browser';

import { defineComponent, onMounted, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'WebAuthN',
  components: { WidgetLayout, GenericForm },
  setup() {
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const supported = ref<boolean>(false)
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
        let response
        try {
          if (context.details.authentication_options) {
            response = await verifyDevice({
              optionsJSON: context.details.authentication_options
            })
          } else if (context.details.registration_options) {
            response = await registerDevice({
              optionsJSON: context.details.registration_options,
            })
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
        await http.post({ body: { ...values, response } })
      }
    )

    onMounted(async () => {
      if (!isWebAuthNSupported()) {
        form.value.toggleAlert('errors.webauthn.not_supported', {
          dismissible: false
        })
      }else {
        supported.value = true
      }
    })
    return {
      fields,
      supported,
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
