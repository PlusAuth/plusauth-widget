<script setup lang="ts">
import { watchEffect } from 'vue';

import './PAlert.css';
import { setColorStyle } from '../../utils';

export type PAlertProps = {
  color: string,
  textColor: string,
  type: 'info' | 'error' | 'success' | 'warning',
  text: boolean,
  tile: boolean,
  timeout: number | string
}

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  type?: PAlertProps['type'];
  text?: boolean;
  textColor?: string;
  tile?: boolean;
  timeout?: PAlertProps['timeout'];
}>(), {
  modelValue: true,
  type: 'error',
  text: false,
  textColor: '#fff',
  tile: false,
  timeout: 0
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

let closeTimeout: ReturnType<typeof setTimeout> | undefined;

watchEffect(() => {
  if (props.modelValue && props.timeout) {
    const timeoutVal = Number(props.timeout);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
    closeTimeout = setTimeout(() => {
      emit('update:modelValue', false);
    }, timeoutVal);
  }
});
</script>

<template>
  <transition name="pa__message-transition">
    <div
      v-if="modelValue"
      :style="setColorStyle(
        text
          ? { textColor: textColor || type }
          : { color: type, textColor: textColor }
      )"
      :class="{
        'pa__alert': true,
        'pa__alert--text': text,
        'pa__alert--tile': tile,
      }"
    >
      <div class="pa__alert-content">
        <slot />
      </div>
    </div>
  </transition>
</template>