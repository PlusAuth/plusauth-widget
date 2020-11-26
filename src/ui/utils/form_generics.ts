import deepmerge from 'deepmerge';
import { computed, reactive, ref } from 'vue';

import { AdditionalFields, FieldDefinition } from '../interfaces';

export default (
  defaultFields: AdditionalFields,
  fields: AdditionalFields,
  action: (fields: Record<string, any>) => Promise<any>,
  responseErrorHandler?: (err: Error) => void,
) => {
  const form = ref<any>(null)
  const loading = ref(false)

  const mergedFields = reactive( deepmerge(defaultFields, fields, { clone: false }))

  for (const field in mergedFields) {
    if(!mergedFields[field]){
      delete mergedFields[field]
    }
  }

  return {
    form,
    loading,
    fields: mergedFields,
    validate(options: FieldDefinition, value: any): any {
      if (options.validator) {
        return options.validator(
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
};
