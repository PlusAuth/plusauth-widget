<template>
  <WidgetLayout
    :title="actionCompleted ? 'resetPassword.successfullyReset' : 'resetPassword.title'"
    :logo="!actionCompleted"
  >
    <GenericForm
      v-if="!actionCompleted"
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    >
      <template #password.message="{ message: [ message ], isFocused, isPristine, isDirty }">
        <PasswordStrength
          v-if="isFocused || !isPristine"
          :state="{ isDirty, isPristine, isFocused }"
          :rules="context.settings?.password_policy"
          class="pa__input-details"
          :message="message"
        />
      </template>
    </GenericForm>

    <template
      v-if="!actionCompleted"
      #content-actions
    >
      <p-btn
        color="primary"
        :loading="loading"
        block
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields, FieldDefinition } from '../interfaces';
import { resolveLogo } from '../utils';
import { checkPasswordStrength } from '../utils/check_passsword_strength';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'ResetPassword',
  components: { WidgetLayout, GenericForm, PasswordStrength },
  setup(){

    const http = useHttp()
    const context = useContext()

    const actionCompleted = ref(false)

    const defaultFields: AdditionalFields = {
      password: {
        type: 'password',
        label: 'common.fields.newPassword',
        attrs: {
          autocomplete: 'new-password'
        },
        async validator(fields, value){
          return checkPasswordStrength(value,context.settings?.password_policy || {})
        }
      },
      rePassword: {
        type: 'password',
        label: 'common.fields.rePassword',
        validator: function (fields, value){
          if(fields.password.value !== value){
            return this.$t('errors.passwords_not_match')
          }
          return true
        }
      } as FieldDefinition
    }
    const { form, loading, submit, validate, fields } = useGenericForm(
      'resetPassword',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
        actionCompleted.value= true
      })
    return {
      fields,
      form,
      context,
      actionCompleted,
      loading,
      resolveClientLogo: resolveLogo,
      validate,
      submit,
    }
  },
})
</script>

<style scoped>

</style>
