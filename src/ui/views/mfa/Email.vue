<script setup lang="ts">

import GenericForm from '../../components/GenericForm.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { shortenEmail } from '../../utils/helpers.ts';
import { getUserIdentifierField } from '../../utils/user.ts';

defineOptions({
  name: 'Email'
});

const http = useHttp();
const context = useContext();

const defaultFields: AdditionalFields = {
  user_placeholder: getUserIdentifierField(context),
  code: {
    type: 'text',
    label: 'mfa.email.otpLabel'
  }
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'emailMfa',
  defaultFields,
  async (values) => {
    await http.post({
      body: values
    });
  }
);
</script>

<template>
  <WidgetLayout
    logo="images/icons/email_question.svg"
    :title="{ path: 'mfa.email.title', args: { email: shortenEmail(context.details.email) } }"
  >
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        block
        color="primary"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'mfa.email.submitAction'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p
        v-if="context.details.challenges.length > 1"
      >
        <a
          v-t="'mfa.email.tryAnotherWay'"
          href="signin/challenge"
        />
      </p>
      <ResendAction type="mfa.email.emailType" />
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>