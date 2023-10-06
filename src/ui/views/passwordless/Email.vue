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
        style="max-height: 150px; margin-left: 40px;"
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
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import form_generics from '../../utils/form_generics';
import { Translator, translatorKey } from '../../utils/translator';


export default defineComponent({
  name: 'Email',
  components: { GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

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
      async (fieldWithValues) => {
        try{
          await api.auth.signInPasswordless('email', fieldWithValues)
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
      finalFields,
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
