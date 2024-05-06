<template>
  <WidgetLayout
    :logo="false"
    :title="context.details.dataUrl ? 'passwordless.otp.registerTitle' : 'passwordless.otp.title'"
    :subtitle="context.details.dataUrl ? 'passwordless.otp.registerSubtitle' : undefined"
  >
    <template v-if="context.details.dataUrl">
      <div style="text-align: center">
        <img
          id="mainLogo"
          class="pa__logo"
          alt="Logo"
          style="max-width: 300px; max-height: 300px;"
          :src="context.details.dataUrl"
        >
        <h3
          style="text-align: center;
      background-color: lightgray; border: 1px solid black; margin: 16px 0;"
        >
          {{ context.details.secret }}
        </h3>
      </div>
    </template>
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        block
        color="primary"
        type="submit"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'OTP',
  components: { WidgetLayout,  GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const code = ref<string>(null as any)
    const error = ref<string>(null as any)

    const defaultFields: AdditionalFields = {
      email: {
        type: 'text',
        value: context.details.email,
        attrs: { readOnly: true },
        slots: {
          append: {
            element: 'button',
            props: {
              type: 'button',
              class: 'pa__btn pa__btn--flat pa__pw-toggle-visibility',
              onClick: (e) => {
                e.preventDefault()
                window.location.assign('/signin')
              },
              'innerHtml': i18n.t('common.edit')
            }
          }
        }
      },
      code: {
        type: 'number',
        label: 'common.enterOtp',
        value: null,
      }
    }
    const { form, loading, submit, fields, validate } = useGenericForm(
      'passwordlessOtp',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
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
