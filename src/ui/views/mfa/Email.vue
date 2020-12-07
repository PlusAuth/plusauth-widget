<template>
  <div class="pa__logo-container">
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="pa__logo"
      alt="Logo"
      src="https://api.plusauth.com/assets/images/icons/email_question.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <h2
      v-t="{ path: 'mfa.email.title', args: { email: context.details.email } }"
    />
  </div>

  <GenericForm
    ref="form"
    :fields="finalFields"
    :validate="validate"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      block
      color="pa__primary"
      :loading="loading"
      @click="submit"
    >
      <span v-t="'common.submit'" />
    </p-btn>
  </div>

  <div
    v-if="context.details.challenges.length > 1"
    class="pa__widget-helpers-section"
  >
    <a
      v-t="'mfa.tryAnotherWay'"
      href="/signin/challenge"
    />
  </div>
</template>

<script lang="ts" >
import { PlusAuthWeb, MFACodeType } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import form_generics from '../../utils/form_generics';


export default defineComponent({
  name: 'Email',
  components: { GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.fields.code',
        validator(fields, value){
          if(!value){
            return this.$t('errors.fieldRequired', [
              this.$t('common.fields.code')
            ])
          }
          return true
        }
      }
    }
    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (fieldWithValues) => {
        try{
          await api.mfa.validateCode(
            fieldWithValues.code.value as string,
            MFACodeType.EMAIL
          )
        }catch (e) {
          finalFields.code.errors = `errors.${e.error}`;
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
</script >

<style scoped >

</style >
