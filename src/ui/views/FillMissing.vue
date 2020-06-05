<template>
  <p-form
    ref="form"
    class="text-center"
    autocomplete="off"
    @submit="submit"
  >
    <img
      style="max-height: 150px"
      class="logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
    <div
      v-t="'fillMissing.title'"
      class="pa__form-title"
    />
    <template v-for="(options, field) in _fields">
      <p-text-field
        :key="field"
        v-model="options.value"
        :error-messages="options.errors"
        v-bind="options.attrs"
        :type="options.type"
        :label="options.label"
        :rules="options.validator ?
          [ validate.bind( null, options) ] : undefined"
      />
    </template>

    <div class="pt-4">
      <p-btn
        color="primary"
        type="submit"
        :loading="loading"
      >
        <span v-t="'fillMissing.submit'" />
      </p-btn>
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-web';
import { defineComponent,
  inject, reactive, ref } from 'vue';

import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';
import form_generics from '../utils/form_generics';
import { Translator, translatorKey } from '../utils/translator';


export default defineComponent({
  name: 'FillMissing',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
      })
    },
  },
  setup(props){
    const api = inject('api') as PlusAuth
    const translator = inject(translatorKey) as Translator

    const context = inject('context') as any
    const contextFields = context?.details?.fields
    const _fields = reactive({})

    if(contextFields){
      if(Array.isArray(contextFields)){
        contextFields.forEach(field => {
          let fieldName: string
          let fieldType: string
          if(typeof field === 'string'){
            fieldName = field
            fieldType = 'text'
          }else {
            fieldName = field.name
            fieldType= field.type
          }
          _fields[field] = {
            value: null,
            type: fieldType,
            label: `fillMissing.${fieldName}`,
            validator(fields: any, value: any){
              if(!value){
                return translator.t(`fillMissing.errors.${fieldName}Required`)
              }
              return true
            }
          }
        })
      }
    }

    const { form, loading, submit, validate } = form_generics(_fields, async (fieldsWithValues) => {
      try{
        await api.auth.updateMissingInformation(fieldsWithValues)
      }catch (e) {
        if(e.field){
          _fields[e.field].errors = e.error
        }else{
          // TODO: display error somewhere
          console.error(e)
        }
      }
    })
    return {
      _fields,
      context,
      translator,
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
