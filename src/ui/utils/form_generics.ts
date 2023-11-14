import deepmerge from 'deepmerge';
import { ref, inject, computed, unref, MaybeRef } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import { AdditionalFields, FieldDefinition } from '../interfaces';

import { Translator, translatorKey } from './translator';

import { isEmail, isPhone } from '.';

export default function (
  this: Record<string, any>,
  defaultFields?: MaybeRef<AdditionalFields | null>,
  action?: (fields: Record<string, any>) => Promise<any>,
) {
  const form = ref<typeof GenericForm>(null as any)
  const loading = ref<boolean>(false)
  const translator = inject(translatorKey) as Translator
  const context = inject('context') as any

  const { fields, responseErrorHandler } = this
  const mergedFields = computed<AdditionalFields>(() =>{
    const merged = deepmerge(
      Object.assign(
        context.params?.state ? {
          state: {
            type: 'text',
            visible: 'hidden',
            value: context.params.state
          },
        }: {},
        unref(defaultFields || {})
      ),
      fields || {},
      { clone: false }
    )
    for (const field in merged) {
      if(!merged[field]){
        delete merged[field]
      }
    }
    return merged
  })


  return {
    form,
    loading,
    fields: mergedFields,
    validate(options: FieldDefinition, field: string, value: any): any {
      if(options.required !== false && !value){
        return translator.t('errors.field_required', [
          translator.t(`common.fields.${field}`)
        ])
      }
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
          mergedFields.value,
          value
        )
      } else {
        return undefined
      }
    },
    async submit($event?: Event) {
      $event?.preventDefault()
      loading.value = true

      // reset error messages
      Object.values(mergedFields.value).forEach(field => {
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

        const fieldsWithValues = Object.keys(mergedFields.value)
          .reduce((prev: any, curr: string) => {
            prev[curr] = mergedFields.value[curr].value
            return prev
          }, {})

        try{
          await action?.(fieldsWithValues)
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
