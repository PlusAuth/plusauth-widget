<template>
  <WidgetLayout
    :logo="isMagicLink ? 'images/icons/plane.svg' : 'images/icons/email_question.svg'"
    :title="isMagicLink ? 'passwordless.email.magicLinkTitle' : {
      path: 'passwordless.email.title', args: { email: context.details.email }
    } "
    :subtitle="isMagicLink ? {
      path: 'passwordless.email.checkText', args: { email: context.details.email}
    }: undefined
    "
  >
    <GenericForm
      v-if="!isMagicLink"
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template
      v-if="!isMagicLink"
      #content-actions
    >
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
      <ResendAction type="common.email" />
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';


export default defineComponent({
  name: 'Email',
  components: { ResendAction, WidgetLayout, GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const isMagicLink = context.prompt?.mode === 'check_email'
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
          if(e.error === 'invalid_code' && finalFields.code){
            finalFields.code.errors = {
              path: `errors.${e.error}`,
              args: e
            };
          }else {
            throw e
          }
        }
      }
    )
    return {
      isMagicLink,
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

<style scoped>

</style>
