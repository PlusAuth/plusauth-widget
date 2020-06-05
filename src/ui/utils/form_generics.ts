import { ref } from 'vue';

import { AdditionalFields, FieldDefinition } from '../interfaces';

export default (
  fields: AdditionalFields,
  action: (fields: Record<string, any>) => Promise<any>
) => {
  const form = ref<any>(null)
  const loading = ref(false)

  return {
    form,
    loading,
    validate(options: FieldDefinition, value: any): any {
      if (options.validator) {
        return options.validator(
          fields,
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
      Object.values(fields).forEach(field => {
        field.errors = null
      })

      const valid = await form.value?.validate()
      if (valid) {
        form.value?.resetValidation()

        const fieldsWithValues = Object.keys(fields).reduce((prev: any, curr: string) => {
          prev[curr] = fields[curr].value
          return prev
        }, {})

        await action(fieldsWithValues)

        loading.value = false
        return false
      } else {
        loading.value = false
      }
    }
  }
};
