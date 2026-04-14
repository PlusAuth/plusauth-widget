<script setup lang="ts">
import { inject, computed, ref, type Ref } from 'vue';
import { PTextField } from '..';
import './PCodeInput.css';
import { type Translator, translatorKey } from '../../utils/translator';

const props = withDefaults(defineProps<{
  label?: string;
  size?: number;
}>(), {
  size: 6
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const i18n = inject(translatorKey) as Translator;

const digits = (() => {
  const d: Record<number, Ref<string | null>> = {};
  for (let i = 0; i < props.size; i++) {
    d[i] = ref(null);
  }
  return d;
})();

const inputRefs = ref<Array<any>>([]);

const innerModelValue = computed(() => {
  return Object.keys(digits).reduce((p, c) => {
    const val = digits[Number(c)].value;
    if (val !== null) {
      p = p + val;
    }
    return p;
  }, '');
});

const onDigitInput = (index: number, val: any) => {
  if (!val || isNaN(Number(val))) {
    digits[index].value = null;
  }
  emit('update:modelValue', innerModelValue.value);
};

const onKeydown = (index: number, event: KeyboardEvent) => {
  event.stopPropagation();
  const value = event.key;

  if (value === 'Tab' || value === 'Enter') {
    return;
  }

  if (value === 'Backspace') {
    if (index !== 0) {
      setTimeout(() => {
        digits[index - 1].value = null;
        inputRefs.value[index - 1]?.focus();
      });
    }
  } else if (value === 'Delete') {
    if (index !== props.size) {
      setTimeout(() => {
        digits[index + 1].value = null;
        inputRefs.value[index + 1]?.focus();
      });
    }
  } else if (value.startsWith('Arrow')) {
    const direction = value.replace('Arrow', '').toLowerCase();
    if (direction === 'left' || direction === 'up') {
      if (index !== 0) {
        inputRefs.value[index - 1]?.focus();
      }
    } else if (direction === 'right' || direction === 'down') {
      if (index + 1 !== props.size) {
        inputRefs.value[index + 1]?.focus();
      }
    }
  } else if (/[0-9]/.test(value)) {
    event.preventDefault();
    const pressedKey = Number(value);
    digits[index].value = String(pressedKey);
    if (index + 1 < props.size) {
      inputRefs.value[index + 1]?.focus();
    }
  }
  emit('update:modelValue', innerModelValue.value);
};

const handleFocus = (e: FocusEvent) => {
  const el = e.target as HTMLInputElement;
  setTimeout(() => {
    if (el.setSelectionRange) {
      el.setSelectionRange(0, el.value.length);
    }
  });
};
</script>

<template>
  <div class="pa__input pa__code-input">
    <label v-if="label" class="pa__input--label">
      {{ i18n.t(label) }}
    </label>
    <div class="pa__input--wrap">
      <PTextField
        v-for="(_, i) in size"
        :key="i"
        ref="inputRefs"
        v-model="digits[i].value"
        type="tel"
        :hide-messages="true"
        :rules="[(v: any) => !!v]"
        class="pa__code-input--digit-box"
        @paste.prevent
        @keypress="(e: KeyboardEvent) => e.key !== 'Enter' && e.preventDefault()"
        @focus="handleFocus"
        @update:model-value="(val: any) => onDigitInput(i, val)"
        @keydown.capture="(e: KeyboardEvent) => onKeydown(i, e)"
      />
    </div>
  </div>
</template>
