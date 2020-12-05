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
    :fields="finalFields"
    :validate="validate"
    :submit="submit"
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
        tabindex="0"
        href="/signup"
        @click.stop
      />
    </div>
    <div v-if="features.forgotPassword">
      <a
        v-t="'login.forgotPassword'"
        tabindex="0"
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
            return this.$t('errors.fieldRequired', [
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
        errors: [],
        validator: function (fields, value){
          if(!value){
            return this.$t('errors.fieldRequired', [
              this.$t('common.fields.password')
            ])
          }
          return true
        }
      },
    }

    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (fieldWithValues) => {
        try{
          await api.auth.signIn(fieldWithValues)
        }catch (e) {
          if(e.error){
            switch (e.error) {
              case 'user_not_found':
                if(finalFields.username){
                  finalFields.username.errors = `errors.${e.error}`;
                }
                break;
              case 'invalid_credentials':
                if(finalFields.password) {
                  finalFields.password.errors = `errors.${e.error}`;
                }
                break;
              case 'email_not_verified':
                finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                  finalFields.username ? finalFields.username.errors  = `errors.${e.error}`: null;
                break;
              default:
                if(finalFields.password){
                  finalFields.password.errors = `errors.${e.error}`
                }
            }
          }
          throw e
        }
      })

    return {
      finalFields,
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
