<template>
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
    <div class="title">
      <span v-t="'register.signUp'" />
    </div>
    <template
      v-for="(options, field) in _fields"
      :key="field"
    >
      <p-text-field
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
              v-t="options.type === 'password' ? 'register.showPassword' : 'register.hidePassword'"
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
        <span v-t="'register.signUp'" />
      </p-btn>
    </div>

    <template
      v-if="features.socialConnections && context.client
        && context.client.social
        && context.client.social.length"
    >
      <div class="text-center pt-4">
        <span v-t="'login.signInWith'" />
      </div>
      <div class="row justify-center">
        <SocialConnectionButton
          v-for="connection in context.client.social"
          :key="connection"
          :type="connection"
          :href="'/social?provider=' + connection"
        />
      </div>
    </template>

    <div
      class="text-center txt1 pt-4 pb-2"
    >
      <span
        v-t="'register.haveAccount'"
        class="pr-2"
      />
      <a
        v-t="'login.signIn'"
        href="/signin"
        @click.stop
      />
    </div>
    <template v-if="features.forgotPassword">
      <div class="text-center subtitle-2">
        <a
          v-t="'login.forgotPassword'"
          href="/signin/recovery"
        />
      </div>
    </template>
  </p-form>
</template>

<script lang="ts" >
import { PlusAuthWeb } from '@plusauth/web';
import deepmerge from 'deepmerge';
import { defineComponent, getCurrentInstance,
  inject, reactive, ref } from 'vue';

import { PForm, PasswordStrength } from '../components';
import PBtn from '../components/PBtn';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields, SocialConnections } from '../interfaces';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'Register',
  components: { SocialConnectionButton, PasswordStrength },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        forgotPassword: true,
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: () => ({})
    },
    socialConnections: {
      type: Array as () => SocialConnections[],
      default: (): SocialConnections[] => ['google', 'facebook']
    }
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      username: {
        attrs: {
          autocomplete: 'username'
        },
        type: 'text',
        label: 'register.username',
        validator(fields, value){
          if(!value){
            return translator.t('register.errors.usernameRequired')
          }
          return true
        }
      },
      password: {
        type: 'password',
        label: 'register.password',
        attrs: {
          autocomplete: 'new-password'
        },
        async validator(fields, value){
          return !value ? translator.t('register.errors.passwordRequired') :
            api.auth.checkPasswordStrength(value,
              context.passwordPolicy || {})
        }
      },
      rePassword: {
        type: 'password',
        label: 'register.rePassword',
        attrs: {
          autocomplete: 'new-password'
        },
        validator(fields, value){
          if(!value){
            return translator.t('register.errors.rePasswordRequired')
          }
          if(fields.password.value !== value){
            return translator.t('register.errors.passwordsNotMatch')
          }
          return true
        }
      }
    }

    const _fields = reactive(deepmerge(defaultFields, props.fields))

    const { form, loading, submit, validate } = form_generics(_fields, async (fieldWithValues) => {
      try{
        await api.auth.signUp(fieldWithValues)
      }catch (e) {
        switch (e.error) {
          case 'already_exists':
            _fields.username['errors'] = e.error;
            break;
          case 'invalid_credentials':
            _fields.password['errors'] = e.error;
            break;
          case 'email_not_verified':
            // TODO: email not verified
            break;
          default:
            _fields.password['errors'] = e.error
        }
      }
    })

    return {
      form,
      context,
      _fields,
      loading,
      resolveClientLogo,
      validate,
      submit
    }
  }
})
</script >

<style scoped >

</style >
