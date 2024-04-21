import deepmerge from 'deepmerge';
import type { MaybeRef } from 'vue';
import { computed, ref, unref, inject } from 'vue';

import type GenericForm from '../components/GenericForm.vue';
import type {
  AdditionalFields,
  FieldDefinition,
  IPlusAuthContext,
  IWidgetSettings, WidgetModes
} from '../interfaces';

import { secondsToReadable } from './helpers.ts';
import { deepToRaw, toReactive } from './to_reactive';
import type { Translator } from './translator';
import { translatorKey } from './translator';

import { isEmail, isPhone } from '.';

export function useGenericForm(
  name: WidgetModes,
  defaultFields?: MaybeRef<AdditionalFields | null>,
  action?: (
    fields: Record<string, any>,
    formFields: Record<string, FieldDefinition>
  ) => Promise<any>
) {
  const settings = inject('settings') as Partial<IWidgetSettings> || {}
  const form = ref<typeof GenericForm>(null as any)
  const loading = ref<boolean>(false)
  const translator = inject(translatorKey) as Translator
  const context = inject('context') as IPlusAuthContext || {}

  const defuFields: AdditionalFields = Object.assign(
    context.params?.state ? {
      state: {
        type: 'text',
        visible: 'hidden',
        value: context.params.state
      },
    } : {} as any,
    unref(defaultFields || {})
  )

  const merged = computed<Record<string, FieldDefinition>>(() => {
    const { fields } = settings.modeOptions?.[name] || {}
    const merged = deepToRaw(deepmerge( defuFields, fields || {}, { clone: true }))
    for (const field in merged) {
      if (!merged[field]) {
        delete merged[field]
      }
    }
    return merged as any
  })

  const mergedFields = toReactive<Record<string, FieldDefinition>>(merged)

  function resolveFormRef(){
    const formRef = form.value?.formRef || form.value
    if (!formRef) {
      throw new Error('Form ref not found')
    }
    if (!formRef.toggleAlert) {
      formRef.toggleAlert = form.value.toggleAlert
    }
    return formRef
  }
  function formErrorHandler(e: any){
    const formRef = resolveFormRef()
    if (settings.modeOptions?.[name]?.responseErrorHandler) {
      settings.modeOptions[name]!.responseErrorHandler!.call(
        undefined,
        e,
        formRef,
        mergedFields
      )
    } else {
      if (e.field && mergedFields[e.field]) {
        mergedFields[e.field].errors = {
          path: `errors.${e.error}`,
          args: e,
        }
      } else if(e.error === 'too_many_requests' && e.$raw?.headers?.get){
        const retryAfter = e.$raw.headers.get('retry-after')
        form.value.toggleAlert({
          path: `errors.${e.error}`,
          args: {
            retry: secondsToReadable(retryAfter, translator),
          }
        })
      } else {
        form.value.toggleAlert({
          path: `errors.${e.error}`,
          args: e,
          fallback: e.error_description || e.message || e.name || e
        })
      }
    }
  }
  return {
    form,
    loading,
    fields: mergedFields,
    formErrorHandler,
    validate(options: FieldDefinition, field: string, value: any): any {
      if (options.required !== false && !value) {
        return translator.t('errors.field_required', {
          field: translator.t(`common.fields.${field}`)
        })
      }
      if (value) {
        if (options.format === 'email' && !isEmail(value)) {
          return translator.t('errors.invalid_entity', {
            field: translator.t(`common.fields.${field}`)
          })
        }
        if (options.format === 'tel' && !isPhone(value)) {
          return translator.t('errors.invalid_entity', {
            field: translator.t(`common.fields.${field}`)
          })
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
    async submit($event?: Event) {
      $event?.preventDefault()
      loading.value = true

      // reset error messages
      Object.values(mergedFields).forEach(field => {
        field.errors = null
      })

      const formRef = resolveFormRef()

      const validationResult = await formRef.validate()
      if (validationResult.valid) {
        formRef.resetValidation()

        const fieldsWithValues = Object.keys(mergedFields)
          .reduce((prev: any, curr: string) => {
            prev[curr] = mergedFields[curr].value
            return prev
          }, {})

        try {
          await action?.(fieldsWithValues, mergedFields)
        } catch (e) {
          formErrorHandler(e)
        } finally {
          loading.value = false
        }
      } else {
        loading.value = false
      }
    }
  }
}

export default () => {
}
