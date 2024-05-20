<template>
  <WidgetLayout
    :title="{
      path: 'passwordless.sms.title',
      args: { phone_number: context.details.phone_number}
    }"
    logo="images/icons/message-on-phone.svg"
  >
    <PTimer
      class="pa__challenge-timer"
      :duration="context.details.code_ttl"
    />
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
        :loading="loading"
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
    <template #content-footer>
      <ResendAction type="common.code" />
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PTimer from '../../components/PTimer/PTimer';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'SMS',
  components: { ResendAction, WidgetLayout, PTimer, GenericForm },
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
        label: 'common.enterOtp'
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
