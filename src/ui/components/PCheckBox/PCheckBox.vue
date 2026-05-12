<script setup lang="ts">
import { computed } from 'vue'

import { useFocus } from '../../composables/focus'
import { makeValidationProps, useValidation } from '../../composables/validation'
import type { ITranslatePath } from '../../interfaces'
import { getUid } from '../../utils/current_instance'
import PMessage from '../PMessage/PMessage.vue'

const props = defineProps({
  name: String,
  color: String,
  label: String,
  trueValue: { default: true },
  falseValue: { default: false },
  modelValue: { default: null },
  type: String,
  ...makeValidationProps()
})

const emit = defineEmits<{
  (e: 'update:focused', value: boolean): void
  (e: 'update:modelValue', value: any): void
}>()

const itemId = `${props.name || 'checkbox'}-${getUid()}`

const { blur, focus, focusClasses, isFocused } = useFocus(props as any, 'pa__input')

const {
  isPristine,
  reset,
  resetValidation,
  isValidating,
  isValid,
  validate,
  validationClasses,
  errorMessages,
  isReadonly,
  isDisabled,
  isDirty
} = useValidation(props as any, 'pa__input')

const classes = computed(() => ({
  [props.color ? `text-${props.color}` : 'text-primary']: true,
  ...focusClasses.value,
  ...validationClasses.value
}))

const onInput = (event: Event) => {
  const isChecked = (event.currentTarget as HTMLInputElement)?.checked
  emit('update:modelValue', isChecked ? props.trueValue : props.falseValue)
}

const messages = computed((): string[] | ITranslatePath[] => {
  if (
    props.errorMessages && (props.errorMessages as any[]).length ||
    !isPristine.value && errorMessages.value.length
  ) {
    return (errorMessages.value as string[] | ITranslatePath[]) || []
  } else if (props.hint && (!!props.persistentHint || isFocused.value)) {
    return [props.hint] as string[]
  } else {
    return (props.messages as string[] | ITranslatePath[]) || []
  }
})

defineExpose({
  validate,
  isValid,
  isReadonly,
  isDisabled,
  isDirty,
  isValidating,
  reset,
  resetValidation,
  isPristine,
  isFocused
})
</script>

<template>
  <div
    class="pa__input pa__input-checkbox"
    :class="classes"
  >
    <div class="pa__input--wrap">
      <input
        :id="itemId"
        name="accept"
        type="checkbox"
        :checked="modelValue === trueValue"
        @focus="focus"
        @blur="blur"
        @change="onInput"
      >
      <label
        :for="itemId"
        class="pa__input--label"
      >
        {{ label }}
      </label>
    </div>
    <div class="pa__input-details">
      <PMessage
        :field="name"
        :value="messages"
      />
    </div>
  </div>
</template>

<style src="./PCheckBox.css"></style>