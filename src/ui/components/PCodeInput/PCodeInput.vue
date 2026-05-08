<script setup lang="ts">
import { inject, computed, ref, type Ref, onBeforeUpdate, watch } from 'vue';
import { PTextField } from '..';
import './PCodeInput.css';
import { type Translator, translatorKey } from '../../utils/translator';

const props = withDefaults(defineProps<{
  label?: string;
  size?: number;
  modelValue?: string;
}>(), {
  size: 6,
  modelValue: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const i18n = inject(translatorKey) as Translator;
const inputRefs = ref<any[]>([]);

onBeforeUpdate(() => {
  inputRefs.value = [];
});

const digits = (() => {
  const d: Record<number, Ref<string | null>> = {};
  for (let i = 0; i < props.size; i++) {
    d[i] = ref(null);
  }
  return d;
})();

const innerModelValue = computed(() => {
  let val = '';
  for (let i = 0; i < props.size; i++) {
    val += (digits[i].value !== null && digits[i].value !== undefined) ? digits[i].value : '';
  }
  return val;
});

const syncDigitsFromModel = (value?: string) => {
  const normalized = (value || '').replace(/\D/g, '');
  for (let i = 0; i < props.size; i++) {
    digits[i].value = normalized[i] || null;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    if (value !== innerModelValue.value) {
      syncDigitsFromModel(value);
    }
  },
  { immediate: true }
);

const onDigitInput = (index: number, val: any) => {
  if (val && !/^\d$/.test(val)) {
    digits[index].value = null;
  }
  emit('update:modelValue', innerModelValue.value);
};

const onKeydown = (index: number, event: KeyboardEvent) => {
  const allowedKeys = ['Tab', 'Enter', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  
  if (allowedKeys.includes(event.key)) {
    if (event.key === 'Backspace' && !digits[index].value && index > 0) {
      digits[index - 1].value = null;
      inputRefs.value[index - 1]?.$el.querySelector('input')?.focus();
    }
    return;
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  digits[index].value = event.key;
  
  if (index < props.size - 1) {
    inputRefs.value[index + 1]?.$el.querySelector('input')?.focus();
  }

  emit('update:modelValue', innerModelValue.value);
};

const handleFocus = (e: FocusEvent) => {
  const el = e.target as HTMLInputElement;
  if (el?.setSelectionRange) {
    setTimeout(() => el.setSelectionRange(0, el.value.length));
  }
};
</script>

<template>
  <div class="pa__input pa__code-input">
    <label v-if="label" class="pa__input--label">
      {{ i18n?.t ? i18n.t(label) : label }}
    </label>
    <div class="pa__input--wrap">
      <PTextField
        v-for="(_, i) in size"
        :key="i"
        :ref="el => { if (el) inputRefs[i] = el }"
        v-model="digits[i].value"
        type="tel"
        inputmode="numeric"
        pattern="[0-9]*"
        :hide-messages="true"
        class="pa__code-input--digit-box"
        @paste.prevent
        @focus="handleFocus"
        @update:model-value="(val: any) => onDigitInput(i, val)"
        @keydown="(e: KeyboardEvent) => onKeydown(i, e)"
      />
    </div>
  </div>
</template>
