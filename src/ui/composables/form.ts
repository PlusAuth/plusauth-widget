import { computed, inject, provide, ref, shallowRef, toRef, watch } from 'vue'
import type { ComputedRef, InjectionKey, PropType, Ref } from 'vue'

import type { ITranslatePath } from '../interfaces';
import type { EventProp } from '../utils/helpers';
import {  propsFactory } from '../utils/props_factory'

import { useProxiedModel } from './proxied_model'
import type { ValidationProps } from './validation'

export interface FormProvide {
  register: (item: {
    id: number | string
    validate: () => Promise<string[]>
    reset: () => void
    resetValidation: () => void
  }) => void
  unregister: (id: number | string) => void
  update: (
    id: number | string,
    isValid: boolean | null, errorMessages: string[] | ITranslatePath[]
  ) => void
  items: Ref<FormField[]>
  isDisabled: ComputedRef<boolean>
  isReadonly: ComputedRef<boolean>
  isValidating: Ref<boolean>
  isValid: Ref<boolean | null>
  validateOn: Ref<FormProps['validateOn']>
}

export interface FormField {
  id: number | string
  validate: () => Promise<string[]>
  reset: () => void
  resetValidation: () => void
  isValid: boolean | null
  errorMessages: string[] | ITranslatePath[]
}

export interface FieldValidationResult {
  id: number | string
  errorMessages: string[]
}

export interface FormValidationResult {
  valid: boolean
  errors: FieldValidationResult[]
}

export interface SubmitEventPromise extends SubmitEvent, Promise<FormValidationResult> {}

export const FormKey: InjectionKey<FormProvide> = Symbol.for('vuetify:form')

export interface FormProps {
  disabled?: boolean
  fastFail?: boolean
  readonly?: boolean
  modelValue: boolean | null
  'onUpdate:modelValue': EventProp<[boolean | null]> | undefined
  validateOn: ValidationProps['validateOn']
}

export const makeFormProps = propsFactory({
  disabled: Boolean,
  fastFail: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
  validateOn: {
    type: String as PropType<FormProps['validateOn']>,
    default: 'input',
  },
}, 'form')

export function createForm(props: FormProps) {
  const model = useProxiedModel(props, 'modelValue')

  const isDisabled = computed(() => props.disabled || false)
  const isReadonly = computed(() => props.readonly || false)
  const isValidating = shallowRef(false)
  const items = ref<FormField[]>([])
  const errors = ref<FieldValidationResult[]>([])

  async function validate(): Promise<{ valid: boolean, errors: any[] }> {
    const results = [] as any[]
    let valid = true

    errors.value = []
    isValidating.value = true

    for (const item of items.value) {
      const itemErrorMessages = await item.validate()

      if (itemErrorMessages.length > 0) {
        valid = false

        results.push({
          id: item.id,
          errorMessages: itemErrorMessages,
        })
      }

      if (!valid && props.fastFail) break
    }

    errors.value = results
    isValidating.value = false

    return { valid, errors: errors.value }
  }

  function reset() {
    items.value.forEach(item => item.reset())
  }

  function resetValidation() {
    items.value.forEach(item => item.resetValidation())
  }

  watch(items, () => {
    let valid = 0
    let invalid = 0
    const results = [] as any[]

    for (const item of items.value) {
      if (item.isValid === false) {
        invalid++
        results.push({
          id: item.id,
          errorMessages: item.errorMessages,
        })
      } else if (item.isValid === true) valid++
    }

    errors.value = results
    model.value =
      invalid > 0 ? false
        : valid === items.value.length ? true
          : null
  }, { deep: true })

  provide(FormKey, {
    register: ({ id, validate, reset, resetValidation }) => {
      if (items.value.some(item => item.id === id)) {
        console.warn(`Duplicate input name "${id}"`)
      }

      items.value.push({
        id,
        validate,
        reset,
        resetValidation,
        isValid: null,
        errorMessages: [],
      })
    },
    unregister: id => {
      items.value = items.value.filter(item => {
        return item.id !== id
      })
    },
    update: (id, isValid, errorMessages) => {
      const found = items.value.find(item => item.id === id)

      if (!found) return

      found.isValid = isValid
      found.errorMessages = errorMessages
    },
    isDisabled,
    isReadonly,
    isValidating,
    isValid: model,
    items,
    validateOn: toRef(props, 'validateOn'),
  })

  return {
    errors,
    isDisabled,
    isReadonly,
    isValidating,
    isValid: model,
    items,
    validate,
    reset,
    resetValidation,
  }
}

export function useForm() {
  return inject(FormKey, null)
}
