<template>
  <div
    class="pa__input"
    :class="classes"
  >
    <div class="pa__input--wrap">
      <label
        v-if="label"
        class="pa__input--label"
      > {{ i18n.t(label) }}
      </label>
      <input
        ref="inputRef"
        class="pa__text-field"
        :name="name"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        v-bind="$attrs"
        @focus="onFocus"
        @blur="blur"
        @input="onInput"
      >
      <slot />
      <slot name="append" />
    </div>

    <div class="pa__input-details">
      <slot
        name="message"
        :message="messages"
        :is-focused="isFocused"
        :is-pristine="isPristine"
        :is-dirty="isDirty"
      >
        <PMessage
          v-if="!hideMessages"
          :field="name"
          :value="messages"
        />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';

import { makeFocusProps, useFocus } from '../../composables/focus';
import { makeValidationProps, useValidation } from '../../composables/validation';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';

export default defineComponent({
  props: {
    name: String,
    type: String,
    placeholder: String,
    color: String,
    label: String,
    disabled: Boolean,
    modelValue: null,
    hideMessages: Boolean,
    loading: Boolean,
    ...makeValidationProps(),
    ...makeFocusProps()
  },
  emits: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    'click:control': (e: MouseEvent) => true,
    'mousedown:control': (e: MouseEvent) => true,
    'update:focused': (focused: boolean) => true,
    'update:modelValue': (val: string) => true,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
  setup(props, { emit, expose }) {
    const inputRef = ref<HTMLInputElement>()
    const i18n = inject(translatorKey) as Translator

    const { focus, focusClasses, isFocused, blur } = useFocus(props, 'pa__input')
    const {
      validationClasses,
      errorMessages,
      validate,
      isValid,
      isValidating,
      resetValidation,
      reset,
      isPristine,
      isReadonly,
      isDisabled,
      isDirty
    } = useValidation(props, 'pa__input')

    const onInput = (event: Event) => {
      emit('update:modelValue', (event.currentTarget as HTMLInputElement)?.value)
    };

    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus()
      }

      if (!isFocused.value) focus()
    }

    const classes = computed(() => {
      return {
        'pa__input--has-value': props.modelValue,
        [props.color ? `text-${props.color}` : 'text-primary']: true,
        ...validationClasses.value,
        ...focusClasses.value,
      }
    })
    expose({
      focus: onFocus,
      blur,
      validate,
      isValid,
      isValidating,
      resetValidation,
      reset,
      isPristine,
      isReadonly,
      isDisabled,
      isDirty
    })

    const messages = computed(() => {
      if (
        props.errorMessages && (props.errorMessages as any[]).length
				|| !isPristine.value && errorMessages.value.length
      ) {
        return errorMessages.value || []
      } else if (props.hint && (props.persistentHint || props.focused)) {
        return props.hint || []
      } else {
        return props.messages || []
      }
    })
    return {
      focus,
      onFocus,
      blur,
      onInput,
      i18n,
      inputRef,
      isFocused,
      isDirty,
      isPristine,
      messages,
      classes
    }
  }
})
</script>

<style src="./PTextField.css" lang="postcss">
</style>
