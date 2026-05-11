<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { makeFocusProps, useFocus } from '../../composables/focus';
import { makeValidationProps, useValidation } from '../../composables/validation';
import { resolveCssVariableVariant } from '../../utils';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';
import type { ITranslatePath } from '../../interfaces';
import PMessage from '../PMessage/PMessage.vue';

const inputVariants = ['outlined', 'filled', 'underlined', 'solo', 'plain', 'regular'] as const

const props = defineProps({
  name: String,
  type: String,
  placeholder: String,
  color: String,
  label: String,
  modelValue: { type: null, default: null },
  hideMessages: Boolean,
  loading: Boolean,
  ...makeValidationProps(),
  ...makeFocusProps()
});

const emit = defineEmits<{
  (e: 'click:control', event: MouseEvent): void;
  (e: 'mousedown:control', event: MouseEvent): void;
  (e: 'update:focused', focused: boolean): void;
  (e: 'update:modelValue', val: any): void;
}>();

const rootRef = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();
const inputVariant = ref<typeof inputVariants[number]>(
  resolveCssVariableVariant('--pa-input-variant', inputVariants)
);
const i18n = inject(translatorKey) as Translator;

const { focus, focusClasses, isFocused, blur } = useFocus(props as any, 'pa__input');
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
} = useValidation(props as any, 'pa__input');

const onInput = (event: Event) => {
  emit('update:modelValue', (event.currentTarget as HTMLInputElement)?.value);
};

const onFocus = () => {
  if (inputRef.value !== document.activeElement) {
    inputRef.value?.focus();
  }
  if (!isFocused.value) focus();
};

onMounted(() => {
  inputVariant.value = resolveCssVariableVariant('--pa-input-variant', inputVariants, rootRef.value)
})

const classes = computed(() => ({
  'pa__input--has-value': !!props.modelValue,
  [`pa__input--variant-${inputVariant.value}`]: true,
  [props.color ? `text-${props.color}` : 'text-primary']: true,
  ...validationClasses.value,
  ...focusClasses.value,
}));

const messages = computed((): string[] | ITranslatePath[] => {
  if (isValid.value === false) {
    return (errorMessages.value as string[] | ITranslatePath[]) || [];
  } else if (props.hint && (props.persistentHint || isFocused.value)) {
    return [props.hint] as string[];
  } else {
    return (props.messages as string[] | ITranslatePath[]) || [];
  }
});

defineExpose({
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
});
</script>

<template>
  <div
    ref="rootRef"
    class="pa__input pa__input-tf--wrap"
    :class="classes"
  >
    <div class="pa__input--wrap ">
      <label
        v-if="label"
        class="pa__input--label"
      > 
        {{ i18n.t(label) }}
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

<style src="./PTextField.css" lang="postcss"></style>
