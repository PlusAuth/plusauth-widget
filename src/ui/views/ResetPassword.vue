<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div
      v-if="context.settings && context.settings.passwordResetFlow === 'newPassword'
        && context.newPassword"
    >
      <span v-t="'resetPassword.informNewPassword'" />

      <div>
        {{ context.newPassword }}
      </div>
    </div>
    <div v-else>
      <div
        v-if="actionCompleted"
        v-t="'resetPassword.successfullyReset'"
      />
      <p-form
        v-else
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
          v-t="'resetPassword.title'"
          class="title"
        />
        <template v-for="(options, field) in _fields">
          <p-text-field
            :key="field"
            v-model="options.value"
            v-bind="options.attrs"
            :error-messages="options.errors"
            :validate-on-init="field === 'password'"
            :type="options.type"
            :label="options.label"
            :rules="options.validator ?
              [ validate.bind( null, options) ] : undefined"
          >
            <template
              v-if="field === 'password'"
              #append
            >
              <p-btn
                type="button"
                tabindex="0"
                class="pa__pw-toggle-visibility"
                @click="options.type === 'password' ? options.type = 'text' : options.type =
                  'password'"
              >
                <span
                  v-t="options.type === 'password' ?
                    'register.showPassword' : 'register.hidePassword'"
                />
              </p-btn>
            </template>
            <template
              v-if="field === 'password'"
              #message="{ message: [ message ], focus, hasState }"
            >
              <PasswordStrength
                v-if="focus || hasState"
                class="pa__input-details"
                :message="message"
              />
              <div
                v-else
                class="pa__messages pa__input-details"
              />
            </template>
          </p-text-field>
        </template>

        <div class="pt-4">
          <p-btn
            color="primary"
            type="submit"
            :loading="loading"
            block
          >
            <span v-t="'resetPassword.submit'" />
          </p-btn>
        </div>
      </p-form>
    </div>
  </transition>
</template>

<script lang="ts">
import deepmerge from 'deepmerge';
import PlusAuth from 'plusauth-web';
import { defineComponent,
  inject, reactive, ref } from 'vue';

import { useRoute } from 'vue-router';

import { PasswordStrength } from '../components';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'ResetPassword',
  components: { PasswordStrength },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({})
    },
  },
  setup(props){
    const api = inject('api') as PlusAuth
    const context = inject('context') as any
    const actionCompleted = ref(false)
    const route = useRoute()
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      password: {
        type: 'password',
        label: 'resetPassword.newPassword',
        attrs: {
          autocomplete: 'new-password'
        },
        async validator(fields, value){
          return !value ? translator.t('resetPassword.errors.newPasswordRequired') :
            api.auth.checkPasswordStrength(value,
              context.passwordPolicy || {})
        }
      },
      rePassword: {
        type: 'password',
        label: 'resetPassword.rePassword',
        validator(fields, value){
          if(!value){
            return translator.t('resetPassword.errors.rePasswordRequired')
          }
          if(fields.password.value !== value){
            return translator.t('resetPassword.errors.passwordsNotMatch')
          }
          return true
        }
      }
    }
    const _fields = reactive(deepmerge(defaultFields, props.fields))
    const { form, loading, submit, validate } = form_generics(_fields, async (fieldWithValues) => {
      try{
        await api.auth.resetPassword(
          fieldWithValues.password as string,
          route.params.token as string
        )
        actionCompleted.value= true
      }catch (e) {
        console.error(e)
        _fields.password['errors'] = e.error;
      }
    })
    return {
      _fields,
      form,
      context,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate,
      submit,
    }
  },
})
</script >

<style scoped >

</style >
