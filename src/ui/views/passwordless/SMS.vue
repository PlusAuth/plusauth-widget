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
      v-if="timerEnabled"
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
    :fields="finalFields"
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
import { defineComponent, inject } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PTimer from '../../components/PTimer';
import type { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import type { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'SMS',
  components: { PTimer, GenericForm },
  props: {
    timerEnabled: {
      type: Boolean as () => boolean,
      default: true
    },
    ...CustomizableFormProps
  },
  setup(props){
    const http = inject('http') as FetchWrapper
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      phone_number: {
        type: 'text',
        value: context.details.phone_number,
        attrs: { readOnly: true },
        slots: {
          append: {
            element: 'button',
            props: {
              class: 'pa__btn pa__btn--flat pa__pw-toggle-visibility',
              onClick: (e) => {
                e.preventDefault()
                window.location.assign('/signin')
              },
              'innerHtml': translator.t('common.edit')
            }
          }
        }
      },
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (values) => {
        try{
          await http.post({ body: values })
        }catch (e) {
          if (e.error) {
            form.value.toggleAlert(`errors.${e.error}`, {
              dismissible: false
            })
          }
          throw e
        }
      }
    )
    return {
      loading,
      finalFields,
      form,
      context,
      validate,
      submit
    }
  }
})
</script>
