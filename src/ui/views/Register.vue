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
          <hr v-t="'login.socialLoginHelper'">
          <div class="pa__widget-social-icons">
            <SocialConnectionButton
              v-for="connection in context.client.social"
              :key="typeof connection === 'string' ? connection : connection.name"
              lang-key="register.signUpWith"
              :connection="connection"
            />
          </div>
        </template>
        <span
          v-t="'register.haveAccount'"
        />
        <a
          v-t="'login.signIn'"
          href="signin"
          @click.stop
        />
        <div v-if="!isPasswordless && context.settings.forgot_password_enabled">
          <a
            v-t="'login.forgotPassword'"
            href="signin/recovery"
          />
        </div>
      </div>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { PasswordStrength } from '../components';
import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields, FieldDefinition } from '../interfaces';
import { resolveLogo } from '../utils';
import { checkPasswordStrength } from '../utils/check_passsword_strength';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'Register',
  components: { WidgetLayout, GenericForm, SocialConnectionButton, PasswordStrength },
  setup() {
    const http = useHttp()
    const context = useContext()

    const connection = context.connection || {} as Exclude<typeof context.connection, undefined>
    const isPasswordless = connection.type && ![
      'social', 'enterprise', 'plusauth'
    ].includes(connection.type)

    let identifierField = connection.type === 'sms' ? 'phone_number' : 'email';

    const defaultFields: AdditionalFields = {
      [identifierField]: {
        order: 0,
        attrs: {
          autocomplete: identifierField
        },
        type: 'text',
        label: `common.fields.${identifierField}`
      },
      ...isPasswordless ? {} : {
        password: {
          order: 1,
          type: 'password',
          label: 'common.fields.password',
          attrs: {
            autocomplete: 'new-password'
          },
          async validator(fields, value) {
            return checkPasswordStrength(value, context.settings?.password_policy || {})
          }
        },
        rePassword: {
          order: 2,
          type: 'password',
          label: 'common.fields.rePassword',
          attrs: {
            autocomplete: 'new-password'
          },
          validator: function (fields, value) {
            if (fields.password.value !== value) {
              return this.$t('errors.passwords_not_match')
            }
            return true
          }
        } as FieldDefinition
      },
    }

    const { form, loading, submit, validate, fields } = useGenericForm(
      'signup',
      defaultFields,
      async (values, finalFields) => {
        try {
          const result = await http.post({ body: values })
          if (result && result.message === 'verification_email_sent') {
            context.details.email = finalFields.email?.value
            context.details.email_verified = false
            window.location.assign('account/verifyEmail')
          }
        } catch (e) {
          switch (e.error) {
            case 'already_exists':
              if (finalFields.email) {
                finalFields.email.errors = `errors.${e.error}`;
              } else if (finalFields.username) {
                finalFields.username.errors = `errors.${e.error}`;
              } else {
                form.value.toggleAlert({
                  path: `errors.${e.error}`,
                  args: e
                });
              }
              break;
            case 'email_not_verified':
              window.location.assign('account/verifyEmail')
              break;
            default:
              throw e
          }
        }
      })

    return {
      form,
      context,
      fields,
      loading,
      isPasswordless,
      resolveClientLogo: resolveLogo,
      validate,
      submit
    }
  }
})
</script>

<style scoped>

</style>
