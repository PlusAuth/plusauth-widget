<script setup lang="ts">
import GenericForm from '../../components/GenericForm.vue';
import PTimer from '../../components/PTimer/PTimer.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { getUserIdentifierField } from '../../utils/user.ts';

defineOptions({
  name: 'SMS'
});

const http = useHttp();
const context = useContext();

const defaultFields: AdditionalFields = {
  user_placeholder: getUserIdentifierField(context),
  code: {
    type: 'text',
    label: 'passwordless.sms.otpLabel'
  }
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'passwordlessSms',
  defaultFields,
  async (values) => {
    await http.post({ body: values });
  }
);
</script>

<template>
  <WidgetLayout
    :title="{
      path: 'passwordless.sms.title',
      args: { phone_number: context.details.phone_number}
    }"
    logo-style="margin-left: 36px"
    logo="images/icons/message-on-phone.svg"
  >
    <PTimer
      class="pa__challenge-timer"
      :duration="context.details.code_ttl"
    />
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
        <span v-t="'passwordless.sms.submitAction'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p>
        <a
          v-t="'passwordless.sms.useAnotherMethod'"
          href="signin/passwordless"
        />
      </p>
      <ResendAction :type="'passwordless.sms.codeType'" />
    </template>
  </WidgetLayout>
</template>