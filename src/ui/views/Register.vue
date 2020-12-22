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
      color="pa__primary"
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
        :key="connection"
        :type="connection"
        :href="'/social?provider=' + connection"
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
    <div v-if="features.forgotPassword">
      <a
        v-t="'login.forgotPassword'"
        href="/signin/recovery"
      />
    </div>
  </div>
</template>

<script lang="ts" >
import { PlusAuthWeb } from '@plusauth/web';
import deepmerge from 'deepmerge';
import { defineComponent, inject, reactive, ref } from 'vue';

import { useRouter } from 'vue-router';

import { PForm, PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import PBtn from '../components/PBtn';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields, SocialConnections } from '../interfaces';
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
    socialConnections: {
      type: Array as () => SocialConnections[],
      default: (): SocialConnections[] => ['google', 'facebook']
    },
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const router = useRouter()
    const defaultFields: AdditionalFields = {
      username: {
        order: 0,
        attrs: {
          autocomplete: 'username'
        },
        type: 'text',
        label: 'common.fields.username',
        validator(fields, value){
          if(!value){
            return this.$t('errors.field_required', [
              this.$t('common.fields.username')
            ])
          }
          return true
        }
      },
      password: {
        order: 1,
        type: 'password',
        label: 'common.fields.password',
        attrs: {
          autocomplete: 'new-password'
        },
        async validator(fields, value){
          return !value ?  this.$t('errors.field_required', [
            this.$t('common.fields.password')
          ]) :
            api.auth.checkPasswordStrength(value,
              context.settings?.passwordPolicy || {})
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
          if(!value){
            return this.$t('errors.field_required', [
              this.$t('common.fields.rePassword')
            ])
          }
          if(fields.password.value !== value){
            return this.$t('errors.passwords_not_match')
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
          const result = await api.auth.signUp(fieldWithValues)
          if(result && result.message === 'verification_email_sent'){
            context.details.email = finalFields.email?.value
            context.details.email_verified = false
            router.push({
              path: '/verifyEmail'
            })
          }
        }catch (e) {
          switch (e.error) {
            case 'already_exists':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                finalFields.username ? finalFields.username.errors  = `errors.${e.error}`: null;
              break;
            case 'email_not_verified':
              window.location.assign('/verifyEmail')
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
      resolveClientLogo,
      validate,
      submit
    }
  }
})
</script >

<style scoped >

</style >
