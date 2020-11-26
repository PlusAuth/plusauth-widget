<template>
  <div class="pa__logo-container">
    <img
      id="mainLogo"
      style="margin-left: 30px;"
      class="pa__logo"
      alt="Logo"
      src="https://api.plusauth.com/assets/images/icons/message-on-phone.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <PTimer
      v-if="timerEnabled"
      class="pa__challenge-timer"
      :duration="120"
    />
    <h2 v-t="{ path: 'mfa.sms.title', args: { phone_number: context.details.phone_number} }" />
  </div>

  <GenericForm
    ref="form"
    :fields="_fields"
    :validate="validate"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      block
      color="pa__primary"
      :loading="loading"
      @click="submit"
    >
      <span v-t="'mfa.sms.submit'" />
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
import PTimer from '../../components/PTimer';
import { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import form_generics from '../../utils/form_generics';
import { Translator, translatorKey } from '../../utils/translator';

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
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'mfa.sms.code',
        validator(fields, value){
          if(!value){
            return translator.t('mfa.sms.errors.codeRequired')
          }
          return true
        }
      }
    }
    const { form, loading, submit, validate, fields: _fields } = form_generics(
      defaultFields,
      props.fields,
      async (fieldWithValues) => {
        try{
          await api.mfa.validateCode(
            fieldWithValues.code.value as string,
            MFACodeType.SMS
          )
        }catch (e) {
          _fields.code.errors = e.error;
        }
      })
    return {
      loading,
      _fields,
      form,
      context,
      validate,
      submit
    }
  }
})
</script >
