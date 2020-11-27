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
  </div>

  <GenericForm
    ref="form"
    :fields="finalFields"
    :validate="validate"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      color="pa__primary"
      block
      :loading="loading"
      @click="submit"
    >
      <span v-t="'fillMissing.submit'" />
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
            finalFields[e.field].errors = e.error
          }else{
          // TODO: display error somewhere
            console.error(e)
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
          finalFields[field.name] = {
            value: null,
            type: fieldType,
            label: `fillMissing.${fieldName}`,
            validator(fields: any, value: any){
              if(!value){
                return this.$t(`fillMissing.errors.${fieldName}Required`)
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
</script >

<style scoped >

</style >
