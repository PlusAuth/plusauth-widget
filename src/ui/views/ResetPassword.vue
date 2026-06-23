<script setup lang="ts">
import { ref } from 'vue';

import { PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../composables';
import type { AdditionalFields, FieldDefinition } from '../interfaces';
import { resolveLogo } from '../utils';
import { checkPasswordStrength } from '../utils/check_passsword_strength';
import { useGenericForm } from '../utils/form_generics';

defineOptions({
  name: 'ResetPassword'
});

const http = useHttp();
const context = useContext();
const { t } = useLocale();

const actionCompleted = ref(false);

const defaultFields: AdditionalFields = {
  password: {
    type: 'password',
    label: 'resetPassword.newPasswordLabel',
    attrs: {
      autocomplete: 'new-password'
    },
    async validator(_fields: any, value: any) {
      return checkPasswordStrength(value, context.settings?.password_policy || {});
    }
  },
  rePassword: {
    type: 'password',
    label: 'resetPassword.rePasswordLabel',
    validator: function (fields: any, value: any) {
      if (fields.password.value !== value) {
        return t('resetPassword.passwordMismatchError');
      }
      return true;
    }
  } as FieldDefinition
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'resetPassword',
  defaultFields,
  async (values) => {
    await http.post({ body: values });
    actionCompleted.value = true;
  }
);

const resolveClientLogo = resolveLogo;
</script>

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
        <span v-t="'resetPassword.submitAction'" />
      </p-btn>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>