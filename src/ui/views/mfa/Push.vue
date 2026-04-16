<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import AuthPlusInfo from '../../components/AuthPlusInfo.vue';
import { AuthPlusLogo } from '../../components/AuthPlusLogo.ts';
import GenericForm from '../../components/GenericForm.vue';
import PSpinner from '../../components/PSpinner/PSpinner.vue';
import ResendAction from '../../components/ResendAction.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';
import { getUserIdentifierField } from '../../utils/user.ts';

defineOptions({
  name: 'Push'
});

const http = useHttp();
const context = useContext();

const urlParams = new URLSearchParams(window.location.search);
const manualMode = computed(() => urlParams.get('useQuery') === 'true');

const isRegistration = ref(!!context.details.dataUrl);
const code = ref<string | null>(null);
const error = ref<string | null>(null);

const defaultFields = computed<AdditionalFields>(() => ({
  user_placeholder: getUserIdentifierField(context),
  ...manualMode.value ? {
    code: {
      type: 'number',
      label: 'common.enterOtp',
      value: null,
    }
  } : {}
}));

const { form, loading, submit, fields, validate, formErrorHandler } = useGenericForm(
  'pushMfa',
  defaultFields,
  async (values) => {
    await http.post({ body: values });
  }
);

async function pollPushValidation(resolve: (value: any) => void, reject: (reason?: any) => void) {
  try {
    resolve(await http.post({
      body: {}
    }));
  } catch (e: any) {
    if (e.error === 'authorization_pending') {
      setTimeout(() => pollPushValidation(resolve, reject), 3000);
    } else if (e.error === 'invalid_code') {
      form.value?.toggleAlert({
        path: `errors.${e.error}`,
        args: e
      });
      loading.value = false;
    } else {
      reject(e);
    }
  }
}

const switchToCode = () => {
  urlParams.set('useQuery', 'true');
  window.location.search = urlParams.toString();
};

const reload = () => {
  window.location.reload();
};

watch([isRegistration, manualMode], async ([newValue, manual]) => {
  await nextTick(async () => {
    if (!newValue && !manual) {
      loading.value = true;
      try {
        await new Promise((resolve, reject) => {
          pollPushValidation(resolve, reject);
        });
      } catch (e) {
        formErrorHandler(e);
      } finally {
        loading.value = false;
      }
    }
  });
}, { immediate: true, flush: 'post' });
</script>

<template>
  <WidgetLayout
    :logo="false"
    :title="isRegistration ? 'mfa.push.enrollTitle'
      : manualMode ? 'mfa.otp.title' : 'mfa.push.title'"
    :subtitle="{
      path: isRegistration ? 'mfa.push.enrollDescription'
        : manualMode ? ''
          : context.details.push_code ?
            'mfa.push.selectCode': 'mfa.push.description',
      args: [
        AuthPlusLogo
      ]
    }"
  >
    <template v-if="isRegistration">
      <AuthPlusInfo />
      <img
        id="mainLogo"
        class="pa__logo pa__qr-code"
        alt="QRCode"
        :src="context.details.dataUrl"
      >
    </template>
    <div
      v-else-if="!manualMode && context.details.push_code"
      class="pa__timer pa__timer--circle"
    >
      <span class="pa__timer--seconds">
        {{ context.details.push_code }}
      </span>
    </div>
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    >
      <template v-if="!manualMode">
        <div
          v-for="device in context.details.devices"
          :key="device.model"
          class="pa__default-border"
          style="padding: 12px; display: flex; align-items: center"
        >
          <PSpinner
            v-if="loading"
            color="primary"
            indeterminate
          />
          <span style="margin-left: 12px">{{ device.vendor }} {{ device.model }}</span>
        </div>
      </template>
    </GenericForm>
    <template #content-actions>
      <p-btn
        v-if="manualMode || isRegistration"
        block
        color="primary"
        :loading="loading"
        @click="(...args) => manualMode ? submit(...args) : reload()"
      >
        <span v-t="manualMode ? 'common.submit': 'common.continue'" />
      </p-btn>
    </template>
    <template
      v-if="!manualMode && (context.details.challenges.length > 1 || !isRegistration)"
      #content-footer
    >
      <p
        v-if="context.details.challenges.length > 1"
      >
        <a
          v-t="'mfa.tryAnotherWay'"
          href="signin/challenge"
        />
      </p>
      <template
        v-if="!isRegistration"
      >
        <p>
          <a
            v-t="'mfa.push.tryCodeAction'"
            @click="switchToCode"
          />
        </p>
        <ResendAction type="common.notification" />
      </template>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>