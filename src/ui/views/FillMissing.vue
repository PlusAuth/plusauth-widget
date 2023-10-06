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
    :fields="finalFields"
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
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import { CustomizableFormProps } from '../mixins/customizable_form';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';


export default defineComponent({
  name: 'FillMissing',
  components: { GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any

    const contextFields = context?.details?.fields

    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      null,
      async (fieldsWithValues) => {
        try{
          await api.auth.updateMissingInformation(fieldsWithValues)
        }catch (e) {
          if(e.field){
            if(finalFields[e.field]){
              finalFields[e.field].errors = `errors.${e.error}`
            }
          }else{
            switch (e.error) {
              case 'already_exists':
                finalFields.email ? finalFields.email.errors = `errors.${e.error}` :
                  finalFields.username ? finalFields.username.errors  = `errors.${e.error}`: null;
                break;
              case 'email_not_verified':
                window.location.assign('/account/verifyEmail')
                break;
              default:
                if(finalFields.password){
                  finalFields.password['errors'] = `errors.${e.error}`
                }
            }
          }
          throw e
        }
      }
    )

    if(contextFields){
      if(Array.isArray(contextFields)){
        contextFields.forEach(field => {
          let fieldName: string
          let fieldType
          if(typeof field === 'string'){
            fieldName = field
            fieldType = 'text'
          }else {
            fieldName = field.name
            fieldType= field.type
          }
          finalFields[fieldName] = {
            value: null,
            type: fieldType,
            label: `common.fields.${fieldName}`,
            validator(fields: any, value: any){
              if(!value){
                return this.$t('errors.field_required', [
                  this.$t(`common.fields.${fieldName}`)
                ])
              }
              return true
            }
          }
        })
      }
    }

    return {
      finalFields,
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
