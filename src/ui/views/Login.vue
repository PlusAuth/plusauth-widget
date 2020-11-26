<template>
  <div class="pa__logo-container">
    <img
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
  </div>

  <div class="pa__widget-info-section">
    <h1 v-t="'login.signIn'" />
  </div>

  <GenericForm
    ref="form"
    :fields="_fields"
    :validate="validate"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      color="pa__primary"
      :loading="loading"
      block
      @click="submit"
    >
      <span v-t="'login.signIn'" />
    </p-btn>
  </div>

  <div
    v-if="features.socialConnections && context.client
      && context.client.social
      && context.client.social.length"
    class="pa__widget-social-section"
  >
    <h4 v-t="'login.signInWith'" />
    <div class="pa__widget-social-icons">
      <SocialConnectionButton
        v-for="connection in context.client.social"
        :key="connection"
        :type="connection"
        :href="'/social?provider=' + connection"
      />
    </div>
  </div>

  <div class="pa__widget-helpers-section">
    <div
      v-if="features.signUp"
    >
      <span
        v-t="'login.noAccount'"
      />
      <a
        v-t="'login.signUp'"
        href="/signup"
        @click.stop
      />
    </div>
    <div v-if="features.forgotPassword">
      <a
        v-t="'login.forgotPassword'"
        href="/signin/recovery"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent,  ref, inject } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields } from '../interfaces';
import {  CustomizableFormProps } from '../mixins/customizable_form';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';

export default defineComponent({
  name: 'Login',
  components: { GenericForm, SocialConnectionButton },
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
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const passwordVisible = ref(false)
    const translator = inject(translatorKey) as Translator

    const defaultFields: AdditionalFields = {
      username: {
        order: 0,
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
        order: 1,
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

    const { form, loading, submit, validate, fields: _fields } = form_generics(
      defaultFields,
      props.fields,
      async (fieldWithValues) => {
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
