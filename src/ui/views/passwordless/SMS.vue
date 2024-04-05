<template>
  <div class="pa__logo-container">
    <img
      id="mainLogo"
      style="margin-left: 30px;"
      class="pa__logo"
      alt="Logo"
      src="https://static.plusauth.com/images/icons/message-on-phone.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <PTimer
      class="pa__challenge-timer"
      :duration="120"
    />
    <h2
      v-t="{
        path: 'passwordless.sms.title',
        args: { phone_number: context.details.phone_number}
      }"
    />
  </div>

  <GenericForm
    ref="form"
    :fields="fields"
    :validate="validate"
    :submit="submit"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      block
      color="primary"
      :loading="loading"
      @click="submit"
    >
      <span v-t="'common.submit'" />
    </p-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PTimer from '../../components/PTimer/PTimer';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'SMS',
  components: { PTimer, GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const defaultFields: AdditionalFields = {
      phone_number: {
        type: 'text',
        value: context.details.phone_number,
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
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields } = useGenericForm(
      'passwordlessSms',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
      }
    )
    return {
      loading,
      fields,
      form,
      context,
      validate,
      submit
    }
  }
})
</script>
