<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div v-if="!actionCompleted">
      <div class="pa__logo-container">
        <img
          class="pa__logo"
          alt="Logo"
          :src="resolveClientLogo(context.client)"
        >
      </div>

      <div class="pa__widget-info-section">
        <h1 v-t="'forgotPassword.title'" />
        <h2 v-t="'forgotPassword.subtitle'" />
      </div>

      <GenericForm
        ref="form"
        :fields="finalFields"
        :validate="validate"
        :submit="submit"
      />

      <div class="pa__widget-content-actions">
        <p-btn
          color="primary"
          :loading="loading"
          block
          @click="submit"
        >
          <span v-t="'common.submit'" />
        </p-btn>
      </div>
    </div>
    <template v-else>
      <div class="pa__column">
        <div class="pa__logo-container">
          <img
            src="https://static.plusauth.com/images/icons/plane.svg"
            class="pa__logo"
            alt="Mail Confirmation"
          >
        </div>
        <div class="pa__widget-info-section">
          <h2 v-t="{ path: 'forgotPassword.emailSent', args: {email: finalFields.email.value } }" />
        </div>
      </div>
    </template>
  </transition>
</template>

<script lang="ts">
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject, ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import { AdditionalFields } from '../interfaces';
import { CustomizableFormProps } from '../mixins/customizable_form';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';

export default defineComponent({
  name: 'ForgotPassword',
  components: { GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const actionCompleted = ref(false)
    const context = inject('context') as any

    const defaultFields: AdditionalFields = {
      email: {
        type: 'text',
        format: 'email',
        label: 'common.fields.email'
      }
    }

    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (fieldsWithValues) => {
        try{
          await api.auth.requestResetPassword(
            fieldsWithValues.email as string
          )
          actionCompleted.value= true
        }catch (e) {
          if(finalFields.email){
            switch (e.error) {
              case 'user_not_found':
                finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                  finalFields.username ? finalFields.username.errors  = `errors.${e.error}`: null;
                break;
              case 'invalid_credentials':
                finalFields.email['errors'] = `errors.${e.error}`;
                break;
              case 'email_not_verified':
                // TODO: email not verified
                break;
              default:
                finalFields.email['errors'] = `errors.${e.error}`
            }
          }

          throw e
        }
      })

    return {
      finalFields,
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
</script>

<style scoped>

</style>
