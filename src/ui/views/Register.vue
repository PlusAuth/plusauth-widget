<script setup lang="ts">
import { PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../composables';
import type { AdditionalFields, FieldDefinition } from '../interfaces';
import { resolveLogo } from '../utils';
import { checkPasswordStrength } from '../utils/check_passsword_strength';
import { useGenericForm } from '../utils/form_generics';

defineOptions({
  name: 'Register'
});

const http = useHttp();
const context = useContext();
const { t } = useLocale();

const connection = (context.connection || {}) as any;
const identifierField = connection.type === 'sms' ? 'phone_number' : 'email';

const defaultFields: AdditionalFields = {
  [identifierField]: {
    order: 0,
    attrs: {
      autocomplete: identifierField
    },
    type: 'text',
    label: identifierField === 'email' ? 'register.emailLabel' : 'register.phoneLabel'
  },
  ...connection.require_password !== false ? {
    password: {
      order: 1,
      type: 'password',
      label: 'register.passwordLabel',
      attrs: {
        autocomplete: 'new-password'
      },
      async validator(_fields: any, value: any) {
        return checkPasswordStrength(value, context.settings?.password_policy || {});
      }
    },
    rePassword: {
      order: 2,
      type: 'password',
      label: 'register.rePasswordLabel',
      attrs: {
        autocomplete: 'new-password'
      },
      validator: (fields: any, value: any) => {
        if (fields.password.value !== value) {
          return t('register.passwordMismatchError');
        }
        return true;
      }
    } as FieldDefinition
  } : {}
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'signup',
  defaultFields,
  async (values, finalFields) => {
    try {
      const result = await http.post({ body: values });
      if (result && result.message === 'verification_email_sent') {
        context.details.email = finalFields.email?.value;
        context.details.email_verified = false;
        window.location.assign('account/verifyEmail');
      }
    } catch (e: any) {
      switch (e.error) {
        case 'already_exists':
          if (finalFields.email) {
            finalFields.email.errors = 'register.alreadyExistsError';
          } else if (finalFields.username) {
            finalFields.username.errors = 'register.alreadyExistsError';
          } else {
            form.value?.toggleAlert({
              path: 'register.alreadyExistsError',
              args: e
            });
          }
          break;
        case 'email_not_verified':
          window.location.assign('account/verifyEmail');
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
  <WidgetLayout title="register.title">
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    >
      <template #password.message="{ message: [ message ], isFocused, isPristine, isDirty }">
        <PasswordStrength
          v-if="isFocused || !isPristine"
          :state="{isFocused, isPristine, isDirty}"
          :rules="context.settings?.password_policy"
          :message="message"
        />
      </template>
    </GenericForm>

    <template #content-actions>
      <p-btn
        color="primary"
        :loading="loading"
        block
        @click="submit"
      >
        <span v-t="'register.signUp'" />
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
            <span v-t="'register.socialLoginHelper'"></span>
          </div>
          <div class="pa__widget-social-icons">
            <SocialConnectionButton
              v-for="connectionItem in context.client.social"
              :key="typeof connectionItem === 'string' ? connectionItem : connectionItem.name"
              lang-key="register.signUpWith"
              :connection="connectionItem"
            />
          </div>
        </template>
        <span
          v-t="'register.haveAccount'"
        />
        <a
          v-t="'register.signIn'"
          href="signin"
          @click.stop
        />
        <div v-if="context.settings.forgot_password_enabled">
          <a
            v-t="'register.forgotPassword'"
            href="signin/recovery"
          />
        </div>
      </div>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>