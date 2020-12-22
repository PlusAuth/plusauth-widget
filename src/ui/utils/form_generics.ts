import deepmerge from 'deepmerge';
import { computed, reactive, ref, Prop, inject } from 'vue';

import { AdditionalFields, FieldDefinition } from '../interfaces';

import { Translator, translatorKey } from './translator';

import { isEmail, isPhone } from '.';

export default function (
  this: Record<string, any>,
  defaultFields: AdditionalFields | null,
  action: (fields: Record<string, any>) => Promise<any>,
) {
  const form = ref<any>(null)
  const loading = ref(false)
  const translator = inject(translatorKey) as Translator
  const { fields, responseErrorHandler } = this
  const mergedFields = reactive( deepmerge(defaultFields || {}, fields || {}, { clone: false }))

  for (const field in mergedFields) {
    if(!mergedFields[field]){
      delete mergedFields[field]
    }
  }

  return {
    form,
    loading,
    fields: mergedFields,
    validate(options: FieldDefinition, field: string, value: any): any {
      if(value){
        if(options.format === 'email' && !isEmail(value)){
          return translator.t('errors.invalid_entity', [
            translator.t(`common.fields.${field}`)
          ])
        }
        if(options.format === 'tel' && !isPhone(value)){
          return translator.t('errors.invalid_entity', [
            translator.t(`common.fields.${field}`)
          ])
        }
      }

      if (options.validator) {
        return options.validator.call(
          { $t: translator.t.bind(translator) },
          mergedFields,
          value
        )
      } else {
        return undefined
      }
    },
    async submit($event: Event) {
      $event.preventDefault()
      loading.value = true

      // reset error messages
      Object.values(mergedFields).forEach(field => {
        field.errors = null
      })

      const formRef = form.value?.formRef || form.value
      if(!formRef){
        throw new Error('Form ref not found')
        return
      }
      const valid = await formRef.validate()
      if (valid) {
        formRef.resetValidation()

        const fieldsWithValues = Object.keys(mergedFields).reduce((prev: any, curr: string) => {
          prev[curr] = mergedFields[curr].value
          return prev
        }, {})

        try{
          await action(fieldsWithValues)
        }catch (e) {
          if(responseErrorHandler){
            responseErrorHandler.call(undefined, e)
          }
          loading.value = false
          throw e
        }
        loading.value = false
      } else {
        loading.value = false
      }
    }
  }
}
