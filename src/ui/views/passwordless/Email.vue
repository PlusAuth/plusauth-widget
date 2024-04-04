<template>
  <template v-if="context.prompt?.mode === 'check_email'">
    <div class="pa__logo-container">
      <img
        src="https://static.plusauth.com/images/icons/plane.svg"
        class="pa__logo"
        alt="Mail Confirmation"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1 v-t="'passwordless.email.title'" />
      <h2 v-t="{path: 'passwordless.email.checkText', args: { email: context.details.email}}" />
    </div>
  </template>
  <template v-else>
    <div class="pa__logo-container">
      <img
        id="mainLogo"
        class="pa__logo"
        alt="Logo"
        src="https://static.plusauth.com/images/icons/email_question.svg"
      >
    </div>
    <div class="pa__widget-info-section">
      <h2
        v-t="{ path: 'passwordless.email.title', args: { email: context.details.email } }"
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

  <div class="pa__widget-content-footer">
    <p align="center">
      <span
        v-t="'verifyEmail.resendText'"
        style="padding-right: 4px"
      /><a
        v-t="'verifyEmail.resendAction'"
        :href="resendLink"
      />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import type { AdditionalFields, IPlusAuthContext, IWidgetSettings } from '../../interfaces';
import type { FetchWrapper } from '../../utils/fetch';
import { useGenericForm } from '../../utils/form_generics';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';


export default defineComponent({
  name: 'Email',
  components: { GenericForm },
  setup(){
    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator
    const settings = inject('settings') as Partial<IWidgetSettings>

    const resendLink = `${window.location.pathname  }/resend`

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
    const { form, loading, submit, validate, fields } = useGenericForm(
      'passwordlessEmail',
      defaultFields,
      async (values, finalFields) => {
        try{
          await http.post({ body: values })
        }catch (e) {
          if (e.error) {
            if(e.error === 'invalid_code'){
              finalFields.code.errors = `errors.${e.error}`;
            }else {
              form.value.toggleAlert(`errors.${e.error}`, {
                dismissible: false
              })
            }
          }
          throw e
        }
      }
    )
    return {
      loading,
      fields,
      form,
      context,
      resendLink,
      validate,
      submit
    }
  }
})
</script>

<style scoped>

</style>
