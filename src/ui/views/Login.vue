<script setup lang="ts">
import { ref, computed } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';

defineOptions({
  name: 'Login'
});

const http = useHttp();
const context = useContext();

const passwordVisible = ref(false);

const connection = (context.connection || {}) as any;
const isPasswordless = computed(() => {
  return connection.type && ![
    'social',
    'enterprise',
    'plusauth'
  ].includes(connection.type);
});

const identifierField = connection.type === 'sms' ? 'phone_number' : 'email';

const defaultFields: AdditionalFields = {
  [identifierField]: {
    order: 0,
    attrs: {
      autocomplete: identifierField
    },
    value: context.params.login_hint,
    type: 'text',
    label: `common.fields.${identifierField}`,
    format: identifierField === 'email' ? 'email' : undefined
  },
  ...isPasswordless.value ? {} : {
    password: {
      order: 1,
      type: 'password',
      label: 'common.fields.password',
    }
  },
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'login',
  defaultFields,
  async (values, finalFields) => {
    form.value?.toggleAlert(null);
    try {
      await http.post({ body: values });
    } catch (e: any) {
      switch (e.error) {
        case 'user_not_found':
          if (finalFields[identifierField]) {
            finalFields[identifierField].errors = `errors.${e.error}`;
          }
          break;
        case 'email_not_verified':
          window.location.assign('account/verifyEmail');
          break;
        case 'invalid_password':
          if (finalFields.password) {
            finalFields.password.errors = `errors.${e.error}`;
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
  <WidgetLayout title="login.title">
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
        <span v-t="'login.signIn'" />
      </p-btn>
    </template>
    <template #content-append>
      <div class="pa__widget-helpers-section">
        <template
          v-if="context.client
            && context.client.social
            && context.client.social.length"
        >
          <div class="pa__social-seperator">
            <span v-t="'login.socialLoginHelper'"></span>
          </div>
          <div class="pa__widget-social-icons">
            <SocialConnectionButton
              v-for="connectionItem in context.client.social"
              :key="typeof connectionItem === 'string' ? connectionItem : connectionItem.name"
              lang-key="login.signInWith"
              :connection="connectionItem"
            />
          </div>
        </template>
        <div
          v-if="context.settings.register_enabled"
        >
          <span
            v-t="'login.noAccount'"
          />
          <a
            v-t="'login.signUp'"
            tabindex="0"
            href="signup"
            @click.stop
          />
        </div>
        <div v-if="!isPasswordless && context.settings.forgot_password_enabled">
          <a
            v-t="'login.forgotPassword'"
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