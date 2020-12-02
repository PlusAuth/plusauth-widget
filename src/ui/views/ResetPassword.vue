<template>
  <div
    v-if="actionCompleted"
    v-t="'resetPassword.successfullyReset'"
  />
  <template v-else>
    <div class="pa__logo-container">
      <img
        class="pa__logo"
        alt="Logo"
        :src="resolveClientLogo(context.client)"
      >
    </div>
    <div class="pa__widget-info-section">
      <h1 v-t="'resetPassword.title'" />
    </div>

    <GenericForm
      ref="form"
      :fields="finalFields"
      :validate="validate"
    >
      <template #password.message="{ message: [ message ], focus, hasState }">
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
    </GenericForm>


    <div class="pa__widget-content-actions">
      <p-btn
        color="pa__primary"
        :loading="loading"
        block
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </div>
  </template>
</template>

<script lang="ts">
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject, ref } from 'vue';

import { useRoute } from 'vue-router';

import { PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import { AdditionalFields } from '../interfaces';
import { CustomizableFormProps } from '../mixins/customizable_form';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';

export default defineComponent({
  name: 'ResetPassword',
  components: { GenericForm, PasswordStrength },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    },
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const actionCompleted = ref(false)
    const route = useRoute()

    const defaultFields: AdditionalFields = {
      password: {
        type: 'password',
        label: 'common.fields.newPassword',
        attrs: {
          autocomplete: 'new-password'
        },
        async validator(fields, value){
          return !value ? this.$t('errors.fieldRequired', [
            this.$t('common.fields.password')
          ]) :
            api.auth.checkPasswordStrength(value,
              context.passwordPolicy || {})
        }
      },
      rePassword: {
        type: 'password',
        label: 'common.fields.rePassword',
        validator(fields, value){
          if(!value){
            return this.$t('errors.fieldRequired', [
              this.$t('common.fields.rePassword')
            ])
          }
          if(fields.password.value !== value){
            return this.$t('errors.passwordsNotMatch')
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
          await api.auth.resetPassword(
            fieldWithValues.password as string,
            route.params.token as string
          )
          actionCompleted.value= true
        }catch (e) {
          finalFields.password['errors'] = `errors.${e.error}`;
          throw e
        }
      })
    return {
      finalFields,
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
