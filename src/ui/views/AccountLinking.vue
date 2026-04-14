<template>
  <WidgetLayout title="accountLinking.title">
    <template #info>
      <div class="pa__account-merge-list">
        <UserAvatar
          :initials="getUserInitials(context.details.merge_with)"
          :picture="context.details.merge_with.picture"
        />
        <MergeIcon />
        <UserAvatar
          :initials="getUserInitials(context.details.user)"
          :picture="context.details.user.picture"
        />
      </div>
      <h2>
        {{ i18n.t('accountLinking.description') }}
      </h2>
    </template>

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
        :href="context.details.merge_context.url"
        @click="submit"
      >
        <span v-t="context.details.merge_context.url ? 'common.continue' : 'common.submit'" />
      </p-btn>
    </template>
    <template #content-append>
      <div class="pa__widget-helpers-section" />
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Avatar from '../components/Avatar.vue';
import GenericForm from '../components/GenericForm.vue';
import MergeIcon from '../components/MergeIcon.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';
import { getUserInitials } from '../utils/user.ts';

export default defineComponent({
  name: 'AccountLinking',
  components: { MergeIcon, UserAvatar: Avatar, WidgetLayout, GenericForm },
  setup() {
    const http = useHttp()
    const context = useContext()
    const mergeContext = context.details.merge_context || {}
    const passwordVisible = ref(false)
    const i18n = useLocale()
    const defaultFields: AdditionalFields = mergeContext.type === 'password' ? {
      password: {
        order: 1,
        type: 'password',
        label: 'common.fields.password',
      },
    } : {}

    const { form, loading, submit, validate, fields } = useGenericForm(
      'accountLinking',
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
      i18n,
      fields,
      context,
      form,
      loading,
      passwordVisible,
      validate,
      submit,
      resolveClientLogo: resolveLogo
    }

  },
  methods: { getUserInitials }
})
</script>

<style>
.account-merge-list {
  @apply flex justify-center items-center my-4 px-12;

  svg {
    @apply mx-2;
    min-width: 24px;
  }
}
</style>
