<template>
  <p-form
    ref="form"
    class="text-center"
    autocomplete="off"
    @submit="submit"
  >
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="logo"
      alt="Logo"
      src="/images/icons/message-on-phone.svg"
    >
    <PTimer
      v-if="timerEnabled"
      :duration="120"
    />
    <div
      v-t="{ path: 'mfa.sms.title', args: { phone_number:
        context.details.phone_number
      } }"
      class="subtitle-2 text-left"
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

    <div class="pt-4">
      <p-btn
        type="submit"
        block
        color="primary"
        :loading="loading"
      >
        <span v-t="'mfa.sms.submit'" />
      </p-btn>
    </div>
    <div
      v-if="context.details.challenges.length > 1"
      class="row justify-center pt-4"
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

import PTimer from '../../components/PTimer';
import { AdditionalFields } from '../../interfaces';
import form_generics from '../../utils/form_generics';
import { Translator, translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'SMS',
  components: { PTimer },
  props: {
    timerEnabled: {
      type: Boolean as () => boolean,
      default: true
    }
  },
  setup(){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const fields: AdditionalFields = {
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
    const { form, loading, submit, validate } = form_generics(fields, async (fieldWithValues) => {
      try{
        await api.mfa.validateCode(
          fieldWithValues.code.value as string,
          MFACodeType.SMS
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
