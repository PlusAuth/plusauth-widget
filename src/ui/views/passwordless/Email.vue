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
      <p>
        <a
          v-t="'passwordless.useAnotherMethod'"
          href="signin/passwordless"
        />
      </p>
      <ResendAction type="common.email" />
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import {  defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { getUserIdentifierField } from '../../utils/user.ts';

export default defineComponent({
  name: 'Email',
  components: { ResendAction, WidgetLayout, GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const isMagicLink = context.prompt?.mode === 'check_email'
    const defaultFields: AdditionalFields = {
      user_placeholder: getUserIdentifierField(context),
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
