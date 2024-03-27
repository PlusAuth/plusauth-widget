<template>
  <div
    v-if="context.client?.logoUri"
    class="pa__logo-container"
  >
    <img
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
  </div>

  <div class="pa__widget-info-section">
    <h1 v-t="'login.title'" />
  </div>

  <GenericForm
    ref="form"
    :fields="fields"
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
      <span v-t="'login.signIn'" />
    </p-btn>
  </div>

  <div
    v-if="context.client
      && context.client.social
      && context.client.social.length"
    class="pa__widget-social-section"
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
  </div>
  <div class="pa__widget-helpers-section">
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

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import SocialConnectionButton from '../components/SocialConnectionButton.vue';
import type { AdditionalFields, IPlusAuthContext } from '../interfaces';
import { resolveClientLogo } from '../utils';
import type { FetchWrapper } from '../utils/fetch';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'Login',
  components: { GenericForm, SocialConnectionButton },
  setup() {
    const context = inject('context') as IPlusAuthContext
    const http = inject('http') as FetchWrapper

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
          if (e.error) {
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
              case 'too_many_requests':
                const retryAfter = e._raw.headers.get('retry-after')
                form.value.toggleAlert({
                  path: `errors.${e.error}`,
                  args: {
                    retry: retryAfter
                  }
                }, {
                  dismissible: false
                })
                break;
              default:
                form.value.toggleAlert(`errors.${e.error}`, {
                  dismissible: false
                })
            }
          }
          throw e
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
      resolveClientLogo
    }

  }
})
</script>

<style scoped>

</style>
