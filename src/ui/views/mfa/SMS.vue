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
    label: 'common.fields.code'
  }
};

const { form, loading, submit, validate, fields } = useGenericForm(
  'smsMfa',
  defaultFields,
  async (values) => {
    await http.post({ body: values });
  }
);
</script>

<template>
  <WidgetLayout
    :title="{ path: 'mfa.sms.title', args: { phone_number: context.details.phone_number} }"
    logo="images/icons/message-on-phone.svg"
    logo-style="margin-left: 36px"
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
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p
        v-if="context.details.challenges.length > 1"
      >
        <a
          v-t="'mfa.tryAnotherWay'"
          href="signin/challenge"
        />
      </p>
      <ResendAction />
    </template>
  </WidgetLayout>
</template>