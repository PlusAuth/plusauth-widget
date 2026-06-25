<script setup lang="ts">
import {
  nextTick,
  inject,
  watch,
  computed,
  reactive,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue';

import { makeFocusProps, useFocus } from '../../composables/focus';
import { useProxiedModel } from '../../composables/proxied_model';
import { type Translator, translatorKey } from '../../utils/translator';

const props = defineProps({
  modelValue: { type: null, default: null },
  label: { type: String },
  name: { type: String },
  returnObject: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  itemText: { type: String, default: 'name' },
  itemValue: { type: String, default: 'value' },
  items: { type: Array, default: () => [] },
  ...makeFocusProps(),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'change', value: any): void;
  (e: 'click', event: Event): void;
}>();

const inputRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

const cleanupAutoUpdate = ref<(() => void) | null>(null);
const pointerDownInside = ref(false);
const opensUp = ref(false);

const i18n = inject(translatorKey) as Translator;
const internalValue = useProxiedModel(props as any, 'modelValue');
const selectedItem = ref<any>();

const state = reactive({ open: false });

const { blur, focus, focusClasses, isFocused } = useFocus(props as any, 'pa__input');

function updatePosition() {
  if (!containerRef.value || !popoverRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const menuHeight = popoverRef.value.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  opensUp.value = spaceBelow < menuHeight && spaceAbove > spaceBelow;
}

onMounted(() => {
  containerRef.value?.addEventListener('blur', blur);
  containerRef.value?.addEventListener('focus', onFocus);
});

onBeforeUnmount(() => {
  cleanupAutoUpdate.value?.();
});

watch(() => state.open, async (isOpen) => {
  cleanupAutoUpdate.value?.();
  cleanupAutoUpdate.value = null;

  if (isOpen) {
    await nextTick();
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    cleanupAutoUpdate.value = () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };

    nextTick(() => {
      activate(
        popoverRef.value?.querySelector(
          '.pa__input-select-item--selected'
        ) as HTMLElement
      );
    });
  } else {
    popoverRef.value
      ?.querySelectorAll('.pa__input-select-item[tabindex="0"]')
      .forEach((el) => (el as HTMLElement).tabIndex = -1);
  }
});

watch(internalValue, (val) => {
  selectedItem.value = props.items.find(i =>
    val === (typeof i === 'object' ? i?.[props.itemValue as keyof typeof i] : i)
  );

  emit(
    'update:modelValue',
    props.returnObject ? selectedItem.value : internalValue.value
  );
}, { immediate: true });

function onFocus() {
  if (inputRef.value !== document.activeElement) {
    inputRef.value?.focus();
  }
  if (!isFocused.value) focus();
}

function onClick(e: Event) {
  state.open = !state.open;
  emit('click', e);
}

function onPointerDown() {
  pointerDownInside.value = true;
  requestAnimationFrame(() => {
    pointerDownInside.value = false;
  });
}

function onBlur(e: FocusEvent) {
  e.preventDefault();
  e.stopPropagation();

  const relatedTarget = e.relatedTarget as Element | null;

  if (
    pointerDownInside.value ||
    (relatedTarget && inputRef.value?.contains(relatedTarget))
  ) {
    return;
  }

  requestAnimationFrame(() => {
    if (inputRef.value?.contains(document.activeElement)) return;

    state.open = false;
    if (isFocused.value) blur();
  });
}

function getItemText(item: any) {
  return typeof item === 'object' ? item[props.itemText as keyof typeof item] : item;
}

function getItemValue(item: any) {
  return typeof item === 'object' ? item[props.itemValue as keyof typeof item] : item;
}

function onItemClick(event: Event, item: any) {
  event.preventDefault();
  event.stopPropagation();
  internalValue.value = getItemValue(item);
  state.open = false;
}

function activate(item?: HTMLElement | null) {
  if (!item || !popoverRef.value) return;

  popoverRef.value
    .querySelectorAll('.pa__input-select-item')
    .forEach((el) => (el as HTMLElement).tabIndex = -1);

  item.tabIndex = 0;
  nextTick(() => item.focus());
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    state.open = true;
  } else if (e.code === '13') {
    emit('change', internalValue.value);
  } else if (e.key === 'ArrowDown') {
    if (!state.open) {
      state.open = true;
    } else {
      activate(
        popoverRef.value?.querySelector(
          '.pa__input-select-item[tabindex="0"]'
        )?.nextElementSibling as HTMLElement
      );
    }
  } else if (e.key === 'ArrowUp') {
    if (!state.open) {
      state.open = true;
    } else {
      activate(
        popoverRef.value?.querySelector(
          '.pa__input-select-item[tabindex="0"]'
        )?.previousElementSibling as HTMLElement
      );
    }
  }

  emit('keydown', e);
}

const classes = computed(() => ({
  'pa__input-has-value': !!internalValue.value,
  'pa__input-select-is-open': state.open,
  'pa__input-select--open-up': opensUp.value,
  'pa__input-dense': props.dense,
  'pa__input-flat': props.flat,
  ...focusClasses.value
}));
</script>

<template>
  <div
    ref="inputRef"
    class="pa__input pa__input-select"
    :class="classes"
    tabindex="0"
    @keydown="onKeyDown"
    @pointerdown.capture="onPointerDown"
    @click="onClick"
    @blur="onBlur"
  >
    <div
      ref="containerRef"
      class="pa__input--wrap"
    >
      <label
        v-if="label"
        class="pa__input--label"
      > {{ i18n.t(label) }}
      </label>
      <slot name="prepend" />
      <div
        class="pa__input-select-value"
        v-bind="$attrs"
      >
        {{ getItemText(selectedItem) }}
      </div>
      <svg
        class="pa__input-select-arrow"
        width="10"
        height="5"
        viewBox="0 0 10 5"
        fill-rule="evenodd"
      >
        <title>Open drop down</title>
        <path d="M10 0L5 5 0 0z" />
      </svg>
      <div
        ref="popoverRef"
        class="pa__input-select-items"
      >
        <div
          v-for="(item, ind) in items"
          :key="ind"
          :tabindex="-1"
          class="pa__input-select-item"
          :class="{'pa__input-select-item--selected': getItemValue(item) === internalValue }"
          @blur="onBlur"
          @click="onItemClick($event, item)"
          @keydown.enter="onItemClick($event, item)"
        >
          {{ getItemText(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./PSelect.css"></style>
