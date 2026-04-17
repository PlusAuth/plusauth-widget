<script setup lang="ts">
import { inject } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useLocale } from '../composables';
import type { FieldDefinition, IPlusAuthContext } from '../interfaces';
import { resolveLogo } from '../utils';
import type { FetchWrapper } from '../utils/fetch';
import { useGenericForm } from '../utils/form_generics';

defineOptions({
  name: 'FillMissing'
});

const http = inject('http') as FetchWrapper;
const context = inject('context') as IPlusAuthContext;
const { t } = useLocale();

const contextFields = context?.details?.fields;

const { form, loading, submit, validate, fields } = useGenericForm(
  'fillMissing',
  null,
  async (values) => {
    await http.post({ body: values });
  }
);

if (contextFields && Array.isArray(contextFields)) {
  contextFields.forEach((field) => {
    let fieldName: string;
    let fieldType: string;

    if (typeof field === 'string') {
      fieldName = field;
      fieldType = 'text';
    } else {
      fieldName = field.name;
      fieldType = field.type;
    }

    fields[fieldName] = {
      value: null,
      type: fieldType,
      // label: t('fillMissing.fieldLabel', [t(`common.fields.${fieldName}`)]),
      validator: function (_fields: any, value: any) {
        if (!value) {
          return t('fillMissing.fieldRequiredError', {
            field: t(`common.fields.${fieldName}`)
          });
        }
        return true;
      }
    } as FieldDefinition;
  });
}

const resolveClientLogo = resolveLogo;
</script>

<template>
  <WidgetLayout
    title="fillMissing.title"
    subtitle="fillMissing.subtitle"
    :logo="false"
  >
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        color="primary"
        block
        :loading="loading"
        @click="submit"
      >
        <span v-t="'fillMissing.submitAction'" />
      </p-btn>
    </template>
  </WidgetLayout>
</template>

<style scoped>
</style>