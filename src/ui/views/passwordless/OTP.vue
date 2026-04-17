<script setup lang="ts">
import { ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { getUserIdentifierField } from '../../utils/user.ts';

defineOptions({
  name: 'OTP'
});

const http = useHttp();
const context = useContext();

const code = ref<string | null>(null);
const error = ref<string | null>(null);

const defaultFields: AdditionalFields = {
  user_placeholder: getUserIdentifierField(context),
  code: {
    type: 'number',
    label: 'passwordless.otp.otpLabel',
    value: null,
  }
};

const { form, loading, submit, fields, validate } = useGenericForm(
  'passwordlessOtp',
  defaultFields,
  async (values) => {
    await http.post({ body: values });
  }
);
</script>

<template>
  <WidgetLayout
    :logo="false"
    :title="context.details.dataUrl ? 'passwordless.otp.registerTitle' : 'passwordless.otp.title'"
    :subtitle="context.details.dataUrl ? 'passwordless.otp.registerSubtitle' : undefined"
  >
    <template v-if="context.details.dataUrl">
      <div style="text-align: center">
        <img
          id="mainLogo"
          class="pa__logo pa__qr-code"
          alt="Logo"
          style="max-width: 300px; max-height: 300px;"
          :src="context.details.dataUrl"
        >
        <h3
          class="pa__default-border"
          style="text-align: center; background-color: lightgray; margin: 16px 0;"
        >
          {{ context.details.secret }}
        </h3>
      </div>
    </template>
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
        type="submit"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'passwordless.otp.submitAction'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p>
        <a
          v-t="'passwordless.otp.useAnotherMethod'"
          href="signin/passwordless"
        />
      </p>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>