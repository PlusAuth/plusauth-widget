<script setup lang="ts">

import GenericForm from '../../components/GenericForm.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { getUserIdentifierField } from '../../utils/user.ts';

defineOptions({
  name: 'Email'
});

const http = useHttp();
const context = useContext();

const isMagicLink = context.prompt?.mode === 'check_email';

const defaultFields: AdditionalFields = {
  user_placeholder: getUserIdentifierField(context),
  code: {
    type: 'text',
    label: 'passwordless.email.codeLabel'
  }
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'passwordlessEmail',
  defaultFields,
  async (values, finalFields) => {
    try {
      await http.post({ body: values });
    } catch (e: any) {
      if (e.error === 'invalid_code' && finalFields.code) {
        finalFields.code.errors = {
          path: 'passwordless.email.invalidCodeError',
          args: e
        };
      } else {
        throw e;
      }
    }
  }
);
</script>

<template>
  <WidgetLayout
    :logo="isMagicLink ? 'images/icons/plane.svg' : 'images/icons/email_question.svg'"
    :title="isMagicLink ? 'passwordless.email.magicLinkTitle' : {
      path: 'passwordless.email.title', args: { email: context.details.email }
    } "
    :subtitle="isMagicLink ? {
      path: 'passwordless.email.checkText', args: { email: context.details.email}
    }: undefined
    "
  >
    <GenericForm
      v-if="!isMagicLink"
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template
      v-if="!isMagicLink"
      #content-actions
    >
      <p-btn
        block
        color="primary"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'passwordless.email.submitAction'" />
      </p-btn>
    </template>

    <template #content-footer>
      <p>
        <a
          v-t="'passwordless.email.useAnotherMethod'"
          href="signin/passwordless"
        />
      </p>
      <ResendAction type="passwordless.email.emailType" />
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>