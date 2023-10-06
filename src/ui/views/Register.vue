<template>
  <div class="pa__logo-container">
    <img
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
  </div>

  <div class="pa__widget-info-section">
    <h1 v-t="'register.title'" />
  </div>

  <GenericForm
    ref="form"
    :fields="finalFields"
    :validate="validate"
    :submit="submit"
  >
    <template #password.message="{ message: [ message ], focus, hasState }">
      <PasswordStrength
        v-if="focus || hasState"
        :rules="context.settings?.passwordPolicy"
        class="pa__input-details"
        :message="message"
      />
      <div
        v-else
        class="pa__messages pa__input-details"
      />
    </template>
  </GenericForm>
  <div class="pa__widget-content-actions">
    <p-btn
      color="primary"
      :loading="loading"
      block
      @click="submit"
    >
      <span v-t="'register.signUp'" />
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
        :key="connection.name || connection"
        :type="connection.provider || connection"
        :href="'/social?provider=' + connection.name || connection"
      />
    </div>
  </div>

  <div class="pa__widget-helpers-section">
    <span
      v-t="'register.haveAccount'"
    />
    <a
      v-t="'login.signIn'"
      href="/signin"
      @click.stop
    />
    <div v-if="!isPasswordless && features.forgotPassword">
      <a
        v-t="'login.forgotPassword'"
        href="/signin/recovery"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import {  PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields } from '../interfaces';
import { CustomizableFormProps } from '../mixins/customizable_form';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';

export default defineComponent({
  name: 'Register',
  components: { GenericForm, SocialConnectionButton, PasswordStrength },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        forgotPassword: true,
      })
    },
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const connection = context.connection || {}
    const isPasswordless = !['social','enterprise', 'plusauth'].includes(connection.type)
    let identifierField= connection.type === 'sms' ? 'phone_number': 'email';

    const defaultFields: AdditionalFields = {
      [identifierField]: {
        order: 0,
        attrs: {
          autocomplete: identifierField
        },
        type: 'text',
        label: `common.fields.${  identifierField}`
      },
      ...isPasswordless ? {} : {
        password: {
          order: 1,
          type: 'password',
          label: 'common.fields.password',
          attrs: {
            autocomplete: 'new-password'
          },
          async validator(fields, value){
            return api.auth.checkPasswordStrength(value, context.settings?.passwordPolicy || {})
          }
        },
        rePassword: {
          order: 2,
          type: 'password',
          label: 'common.fields.rePassword',
          attrs: {
            autocomplete: 'new-password'
          },
          validator(fields, value){
            if(fields.password.value !== value){
              return this.$t('errors.passwords_not_match')
            }
            return true
          }
        }
      },
    }

    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (fieldWithValues) => {
        try{
          const result = await api.auth.signUp(fieldWithValues)
          if(result && result.message === 'verification_email_sent'){
            context.details.email = finalFields.email?.value
            context.details.email_verified = false
            window.location.assign('/account/verifyEmail')
          }
        }catch (e) {
          switch (e.error) {
            case 'already_exists':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                finalFields.username ? finalFields.username.errors  = `errors.${e.error}`: null;
              break;
            case 'email_not_verified':
              window.location.assign('/account/verifyEmail')
              break;
            default:
              if(finalFields.password){
                finalFields.password['errors'] = `errors.${e.error || e.message || e.name || e}`
              }
          }
          throw e
        }
      })

    return {
      form,
      context,
      finalFields,
      loading,
      isPasswordless,
      resolveClientLogo,
      validate,
      submit
    }
  }
})
</script>

<style scoped>

</style>
