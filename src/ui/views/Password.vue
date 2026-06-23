<script setup lang="ts">
import { ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';
import { getUserIdentifierField } from '../utils/user.ts';

defineOptions({
  name: 'Password'
});

const http = useHttp();
const context = useContext();

const passwordVisible = ref(false);

const defaultFields: AdditionalFields = {
  user_placeholder: getUserIdentifierField(context),
  password: {
    order: 1,
    type: 'password',
    label: 'passwordChallenge.passwordLabel',
  }
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'passwordChallenge',
  defaultFields,
  async (values, finalFields) => {
    form.value?.toggleAlert(null);
    try {
      await http.post({ body: values });
    } catch (e: any) {
      switch (e.error) {
        case 'user_not_found':
          if (finalFields.user_placeholder) {
            finalFields.user_placeholder.errors = 'passwordChallenge.userNotFoundError';
          }
          break;
        case 'email_not_verified':
          window.location.assign('account/verifyEmail');
          break;
        case 'invalid_password':
          if (finalFields.password) {
            finalFields.password.errors = 'passwordChallenge.invalidPasswordError';
          }
          break;
        default:
          throw e;
      }
    }
  }
);

const resolveClientLogo = resolveLogo;
</script>

<template>
  <WidgetLayout title="passwordChallenge.title">
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />

    <template #content-actions>
      <p-btn
        color="primary"
        :loading="loading"
        block
        @click="submit"
      >
        <span v-t="'passwordChallenge.continueAction'" />
      </p-btn>
    </template>
    <template #content-append>
      <div class="pa__widget-helpers-section">
        <div v-if="context.settings.forgot_password_enabled">
          <a
            v-t="'passwordChallenge.forgotPassword'"
            tabindex="0"
            href="signin/recovery"
          />
        </div>
      </div>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>