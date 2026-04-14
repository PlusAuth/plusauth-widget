<script setup lang="ts">
import { withDirectives } from 'vue';
import { i18n as vI18n } from '../../directives/i18n';
import type { ITranslatePath } from '../../interfaces';
import './PMessage.css';

const props = defineProps<{
  value?: string | string[] | Set<any> | ITranslatePath | ITranslatePath[] | null;
  field?: string | null;
}>();

const getI18nBinding = (message: any) => {
  const fieldPath = props.field ? `common.fields.${props.field}` : undefined;

  if (message && typeof message === 'object' && !Array.isArray(message)) {
    return {
      ...message,
      args: {
        ...message.args,
        field: fieldPath,
      },
    };
  }
  
  return {
    path: message,
    args: {
      field: fieldPath,
    },
  };
};

const normalizeMessages = (val: any): any[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (val instanceof Set) return Array.from(val);
  return [val];
};
</script>

<template>
  <div class="pa__messages">
    <transition
      name="pa__message-transition"
      :css="true"
    >
      <div v-if="value">
        <div
          v-for="(msg, index) in normalizeMessages(value)"
          :key="index"
          v-i18n="getI18nBinding(msg)"
          class="pa__messages__message"
        />
      </div>
    </transition>
  </div>
</template>
