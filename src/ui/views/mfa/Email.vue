<template>
  <p-form class="pa__text-center">
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="pa__logo"
      alt="Logo"
      src="https://api.plusauth.com/assets/images/icons/email_question.svg"
    >
    <div
      v-t="{ path: 'mfa.email.title', args: { email: context.details.email } }"
      class="pa__subtitle-2 pa__text-left"
    />
    <template
      v-for="(options, field) in fields"
      :key="field"
    >
      <p-text-field
        v-model="options.value"
        v-bind="options.attrs"
        :type="options.type"
        :label="options.label"
        :rules="options.validator ?
          [ validate.bind( null, options) ] : undefined"
      />
    </template>

    <div class="pa__pt-4">
      <p-btn
        type="submit"
        block
        color="pa__primary"
        :loading="loading"
      >
        <span v-t="'mfa.email.submit'" />
      </p-btn>
    </div>
    <div
      v-if="context.details.challenges.length > 1"
      class="pa__row pa__justify-center pa__pt-4"
    >
      <a
        v-t="'mfa.tryAnotherWay'"
        href="/signin/challenge"
      />
    </div>
  </p-form>
</template>

<script lang="ts" >
import { PlusAuthWeb, MFACodeType } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import { AdditionalFields } from '../../interfaces';
import form_generics from '../../utils/form_generics';
import { Translator, translatorKey } from '../../utils/translator';


export default defineComponent({
  name: 'Email',
  props: {},
  setup(){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const fields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'mfa.email.code',
        validator(fields, value){
          if(!value){
            return translator.t('mfa.email.errors.codeRequired')
          }
          return true
        }
      }
    }
    const { form, loading, submit, validate } = form_generics(fields, async (fieldWithValues) => {
      try{
        await api.mfa.validateCode(
          fieldWithValues.code.value as string,
          MFACodeType.EMAIL
        )
      }catch (e) {
        fields.code.errors = e.error;
      }
    })
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
</script >

<style scoped >

</style >
