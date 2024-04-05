<template>
  <div class="pa__logo-container">
    <img
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
  </div>

  <div class="pa__widget-info-section">
    <h1 v-t="'fillMissing.title'" />
    <h2 v-t="'fillMissing.subtitle'" />
  </div>

  <GenericForm
    ref="form"
    :fields="fields"
    :validate="validate"
    :submit="submit"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      color="primary"
      block
      :loading="loading"
      @click="submit"
    >
      <span v-t="'common.submit'" />
    </p-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import type { FieldDefinition, IPlusAuthContext } from '../interfaces';
import { resolveClientLogo } from '../utils';
import type { FetchWrapper } from '../utils/fetch';
import { useGenericForm } from '../utils/form_generics';


export default defineComponent({
  name: 'FillMissing',
  components: { GenericForm },
  setup() {
    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext

    const contextFields = context?.details?.fields

    const { form, loading, submit, validate, fields } = useGenericForm(
      'fillMissing',
      null,
      async (values) => {
        await http.post({ body: values })
      }
    )

    if (contextFields) {
      if (Array.isArray(contextFields)) {
        contextFields.forEach(field => {
          let fieldName: string
          let fieldType
          if (typeof field === 'string') {
            fieldName = field
            fieldType = 'text'
          } else {
            fieldName = field.name
            fieldType = field.type
          }
          fields[fieldName] = {
            value: null,
            type: fieldType,
            label: `common.fields.${fieldName}`,
            validator: function (fields: any, value: any) {
              if (!value) {
                return this.$t('errors.field_required', [
                  this.$t(`common.fields.${fieldName}`)
                ])
              }
              return true
            }
          } as FieldDefinition
        })
      }
    }

    return {
      fields,
      context,
      resolveClientLogo,
      form,
      loading,
      submit,
      validate,
    }
  },
})
</script>

<style scoped>

</style>
