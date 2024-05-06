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
          <hr v-t="'login.socialLoginHelper'">
          <div class="pa__widget-social-icons">
            <SocialConnectionButton
              v-for="connection in context.client.social"
              :key="typeof connection === 'string' ? connection : connection.name"
              lang-key="login.signInWith"
              :connection="connection"
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
            href="/signup"
            @click.stop
          />
        </div>
        <div v-if="!isPasswordless && context.settings.forgot_password_enabled">
          <a
            v-t="'login.forgotPassword'"
            tabindex="0"
            href="/signin/recovery"
          />
        </div>
      </div>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'Login',
  components: { WidgetLayout, GenericForm, SocialConnectionButton },
  setup() {
    const http = useHttp()
    const context = useContext()

    const passwordVisible = ref(false)

    const connection = context.connection || {} as Exclude<typeof context.connection, undefined>
    const isPasswordless = connection.type && ![
      'social',
      'enterprise',
      'plusauth'
    ].includes(connection.type)
    let identifierField = connection.type === 'sms' ? 'phone_number': 'email';

    const defaultFields: AdditionalFields = {
      [identifierField]: {
        order: 0,
        attrs: {
          autocomplete: identifierField
        },
        type: 'text',
        label: `common.fields.${  identifierField}`,
        format: identifierField === 'email' ? 'email' : undefined
      },
      ...isPasswordless ? {} : {
        password: {
          order: 1,
          type: 'password',
          label: 'common.fields.password',
        }
      },
    }

    const { form, loading, submit, validate, fields } = useGenericForm(
      'login',
      defaultFields,
      async (values, finalFields) => {
        form.value.toggleAlert(null)
        try {
          await http.post({ body: values })
        } catch (e) {
          switch (e.error) {
            case 'user_not_found':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                finalFields.username ? finalFields.username.errors = `errors.${e.error}` : null;
              break;
            case 'email_not_verified':
              window.location.assign('/account/verifyEmail')
              break;
            case 'invalid_password':
              if (finalFields.password) {
                finalFields.password.errors = `errors.${e.error}`;
              }
              break;
            default:
              throw e
          }
        }
      }
    )

    return {
      fields,
      context,
      form,
      loading,
      passwordVisible,
      validate,
      isPasswordless,
      submit,
      resolveClientLogo: resolveLogo
    }

  }
})
</script>

<style scoped>

</style>
