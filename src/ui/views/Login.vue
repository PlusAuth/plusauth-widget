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
      <span v-t="'login.signIn'" />
    </div>
    <template v-for="(options, field) in _fields">
      <p-text-field
        :key="field"
        v-model="options.value"
        v-bind="options.attrs"
        :error-messages="options.errors"
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
              v-t="options.type === 'password' ? 'login.showPassword' : 'login.hidePassword'"
            />
          </p-btn>
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
        <span v-t="'login.signIn'" />
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
      v-if="features.signUp"
      class="text-center txt1 pt-4 pb-2"
    >
      <span
        v-t="'login.noAccount'"
        class="pr-2"
      />
      <a
        v-t="'login.signUp'"
        href="/signup"
        @click.stop
      />
    </div>
    <div class="text-center subtitle-2">
      <a
        v-t="'login.forgotPassword'"
        href="/signin/recovery"
      />
    </div>
  </p-form>
</template>

<script lang="ts">
import deepmerge from 'deepmerge';
import PlusAuth from 'plusauth-web';
import { defineComponent, reactive, ref, inject } from 'vue';

import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'Login',
  components: { SocialConnectionButton },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    socialConnections: {
      type: Array as () => any[],
      default: () => []
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({})
    },
  },
  setup(props){
    const api = inject('api') as PlusAuth
    const context = inject('context') as any
    const passwordVisible = ref(false)
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      username: {
        attrs: {
          autocomplete: 'username'
        },
        type: 'text',
        label: 'login.username',
        validator(fields, value){
          if(!value){
            return translator.t('login.errors.usernameRequired')
          }
          return true
        }
      },
      password: {
        type: 'password',
        label: 'login.password',
        errors: [],
        validator: function (fields, value){
          if(!value){
            return translator.t('login.errors.passwordRequired')
          }
          return true
        }
      },
    }
    const _fields = reactive(deepmerge(defaultFields, props.fields))

    const { form, loading, submit, validate } = form_generics(_fields, async (fieldWithValues) => {
      try{
        await api.auth.signIn(fieldWithValues)
      }catch (e) {
        switch (e.error) {
          case 'user_not_found':
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
      _fields,
      context,
      form,
      loading,
      passwordVisible,
      validate,
      submit,
      resolveClientLogo
    }

  }
})
</script >

<style scoped >

</style >
