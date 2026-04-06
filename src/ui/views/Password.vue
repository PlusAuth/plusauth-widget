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
        <span v-t="'common.continue'" />
      </p-btn>
    </template>
    <template #content-append>
      <div class="pa__widget-helpers-section">
        <div v-if="context.settings.forgot_password_enabled">
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

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';
import { getUserIdentifierField } from '../utils/user.ts';

export default defineComponent({
  name: 'Password',
  components: { WidgetLayout, GenericForm },
  setup() {
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

    const passwordVisible = ref(false)

    const defaultFields: AdditionalFields = {
      user_placeholder: getUserIdentifierField(context),
      password: {
        order: 1,
        type: 'password',
        label: 'common.fields.password',
      }
    }

    const { form, loading, submit, validate, fields } = useGenericForm(
      'passwordChallenge',
      defaultFields,
      async (values, finalFields) => {
        form.value.toggleAlert(null)
        try {
          await http.post({ body: values })
        } catch (e) {
          switch (e.error) {
            case 'user_not_found':
              finalFields.user_placeholder.errors = `errors.${e.error}`;
              break;
            case 'email_not_verified':
              window.location.assign('account/verifyEmail')
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
      submit,
      resolveClientLogo: resolveLogo
    }

  }
})
</script>

<style scoped>

</style>
