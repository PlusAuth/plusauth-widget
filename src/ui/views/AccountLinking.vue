<script setup lang="ts">
import { ref } from 'vue';

import Avatar from '../components/Avatar.vue';
import GenericForm from '../components/GenericForm.vue';
import MergeIcon from '../components/MergeIcon.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';
import { getUserInitials } from '../utils/user.ts';

defineOptions({
  name: 'AccountLinking'
});

const http = useHttp();
const context = useContext();
const i18n = useLocale();

const mergeContext = context.details.merge_context || {};
const passwordVisible = ref(false);

const defaultFields: AdditionalFields = mergeContext.type === 'password' ? {
  password: {
    order: 1,
    type: 'password',
    label: 'common.fields.password',
  },
} : {};

const { form, loading, submit, validate, fields } = useGenericForm(
  'accountLinking',
  defaultFields,
  async (values, finalFields) => {
    form.value?.toggleAlert(null);
    try {
      await http.post({ body: values });
    } catch (e: any) {
      switch (e.error) {
        case 'user_not_found':
          if (finalFields.email) finalFields.email.errors = `errors.${e.error}`;
          else if (finalFields.username) finalFields.username.errors = `errors.${e.error}`;
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
  <WidgetLayout title="accountLinking.title">
    <template #info>
      <div class="pa__account-merge-list">
        <Avatar
          :initials="getUserInitials(context.details.merge_with)"
          :picture="context.details.merge_with.picture"
        />
        <MergeIcon />
        <Avatar
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

<style>
.account-merge-list {
  @apply flex justify-center items-center my-4 px-12;

  svg {
    @apply mx-2;
    min-width: 24px;
  }
}
</style>