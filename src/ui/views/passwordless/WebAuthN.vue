<template>
  <WidgetLayout
    logo="images/icons/pass_credential.svg"
    logo-style="height: 96px;"
    subtitle="passwordless.webauthn.title"
  >
    <GenericForm
      ref="form"
      :disabled="loading"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        color="primary"
        :loading="loading"
        block
        @click="submit"
      >
        <span v-t="'common.continue'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p>
        <a
          v-t="'common.usePassword'"
          href="signin/challenge/pw"
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
import ResendAction from "../../components/ResendAction.vue";

export default defineComponent({
  name: 'WebAuthN',
  components: {ResendAction, WidgetLayout, GenericForm },
  setup() {
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const supported = ref<boolean>(false)
    const code = ref<string>(null as any)
    const error = ref<string>(null as any)
    const loadingMsg = ref<string | null>(null as any)

    const defaultFields: AdditionalFields = {
      user_placeholder: {
        type: 'text',
        value: context.details.user_identifier || context.details.email || context.details.username || context.details.phone_number,
        attrs: { readOnly: true },
        ignored: true,
        slots: {
          append: {
            element: 'button',
            props: {
              type: 'button',
              class: 'pa__btn pa__btn--flat pa__pw-toggle-visibility',
              onClick: (e) => {
                e.preventDefault()
                window.location.assign('signin')
              },
              'innerHtml': i18n.t('common.edit')
            }
          }
        }
      },
      response: {
        type: 'text',
        visible: false,
        value: null,
      }
    }

    const { form, loading, submit, fields, validate } = useGenericForm(
      'passwordlessWebauthn',
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
        await http.post({ body: {...values, response} })
      }
    )

    onMounted(async () => {
      if (!isWebAuthNSupported()) {
        form.value.toggleAlert('errors.webauthn.not_supported', {
          dismissible: false
        })
      } else {
        supported.value = true
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
