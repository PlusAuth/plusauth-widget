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

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useFocus } from '../../composables/focus';
import { makeValidationProps, useValidation } from '../../composables/validation';
import { getUid } from '../../utils/current_instance';
import PMessage from '../PMessage/PMessage';

export default defineComponent({
  components: { PMessage },
  props: {
    name: String,
    color: String,
    label: String,
    trueValue: { type: Boolean, default: true },
    falseValue: { type: Boolean, default: false },
    modelValue: null,
    type: String,
    ...makeValidationProps()
  },
  emits: ['update:focused', 'update:modelValue'],
  setup(props, { emit, expose }) {
    const itemId = `${props.name || 'checkbox'}-${getUid()}`
    const { blur, focus, focusClasses, isFocused } = useFocus(props, 'pa__input')
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
    } = useValidation(props, 'pa__input')
    const classes = computed(() => ({
      [props.color ? `text-${props.color}` : 'text-primary']: true,
      ...focusClasses.value,
      ...validationClasses.value
    }))
    const onInput = (event: Event) => {
      const isChecked = (event.currentTarget as HTMLInputElement)?.checked
      emit('update:modelValue', isChecked ? props.trueValue : props.falseValue)
    };

    expose({
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
    const messages = computed(() => {
      if (props.errorMessages?.length || !isPristine.value && errorMessages.value.length) {
        return errorMessages.value
      } else if (props.hint && (props.persistentHint || props.focused)) {
        return props.hint
      } else {
        return props.messages
      }
    })
    return {
      onInput,
      classes,
      focus,
      blur,
      messages,
      itemId
    }
  }
})
</script>

<style src="./PCheckBox.css">

</style>
