<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div v-if="!actionCompleted">
      <p-form
        ref="form"
        class="text-center"
        autocomplete="off"
        @submit="submit"
      >
        <img
          style="max-height: 150px"
          class="logo"
          alt="Logo"
          :src="resolveClientLogo(context.client)"
        >
        <div
          v-t="'forgotPassword.title'"
          class="title"
        />
        <div
          v-t="'forgotPassword.subtitle'"
          class="subtitle-1"
        />
        <template v-for="(options, field) in _fields">
          <p-text-field
            :key="field"
            v-model="options.value"
            :error-messages="options.errors"
            v-bind="options.attrs"
            :type="options.type"
            :label="options.label"
            :rules="options.validator ?
              [ validate.bind( null, options) ] : undefined"
          />
        </template>

        <div class="pt-4">
          <p-btn
            color="primary"
            type="submit"
            :loading="loading"
            block
          >
            <span v-t="'forgotPassword.submit'" />
          </p-btn>
        </div>
      </p-form>
    </div>
    <div v-else>
      <div class="row ">
        <div class="col col-12 align-center text-center">
          <img
            src="/images/icons/plane.svg"
            style="width: 128px; "
            alt="Mail Confirmation"
          >
        </div>
        <div
          v-t="{ path: 'forgotPassword.emailSent', args: _fields }"
          class="col col-12 text-center"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { PlusAuthWeb } from '@plusauth/web';
import deepmerge from 'deepmerge';
import { defineComponent, inject, reactive, ref } from 'vue';

import { AdditionalFields } from '../interfaces';
import { isEmail, resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'ForgotPassword',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({})
    },
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const actionCompleted = ref(false)
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      email: {
        type: 'email',
        label: 'forgotPassword.email',
        validator(fields, value){
          if(!value){
            return translator.t('forgotPassword.errors.emailRequired')
          }
          if( !isEmail(value)){
            return translator.t('forgotPassword.errors.notValidEmail')
          }
          return true
        }
      }
    }
    const _fields = reactive(deepmerge(defaultFields, props.fields))
    const { form, loading, submit, validate } = form_generics(_fields, async (fieldsWithValues) => {
      try{
        await api.auth.requestResetPassword(
          fieldsWithValues.email as string
        )
        actionCompleted.value= true
      }catch (e) {
        console.error(e)
        switch (e.error) {
          case 'user_not_found':
            _fields.email['errors'] = e.error;
            break;
          case 'invalid_credentials':
            _fields.email['errors'] = e.error;
            break;
          case 'email_not_verified':
            // TODO: email not verified
            break;
          default:
            _fields.email['errors'] = e.error
        }
      }
    })
    return {
      _fields,
      context,
      form,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate,
      submit
    }
  },
})
</script >

<style scoped >

</style >
