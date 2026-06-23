<script setup lang="ts">
import { inject, camelize } from 'vue';

import { setColorStyle } from '../../utils';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';
import PMessage from '../PMessage/PMessage.vue';
import './PasswordStrength.css';

interface State {
  isDirty: boolean;
  isPristine: boolean;
  isFocused: boolean;
}

const props = defineProps<{
  state?: State;
  message?: any;
  rules?: Record<string, any> | null;
}>();

const translator = inject(translatorKey) as Translator;

const getPolicyText = (policy: string) => {
  return translator.t(
    `passwordPolicy.${camelize(policy.replace('_', '-'))}`,
    [props.rules?.[policy]]
  );
};

const getStatusIcon = (policy: string) => {
  if (!props.state?.isDirty) return '○';
  return props.message && props.message[policy] ? '✕' : '✓';
};

const getPolicyStyle = (policy: string) => {
  if (props.state?.isDirty) {
    return setColorStyle({
      textColor: !props.message || !props.message[policy] ? 'success' : 'error'
    });
  }
  return setColorStyle({ textColor: '#000000de' });
};
</script>

<template>
  <template v-if="!rules || typeof message === 'string'">
    <PMessage :value="message" />
  </template>

  <div v-else class="pa__messages pa__pw-strength">
    <template v-for="policy in Object.keys(rules)" :key="policy">
      <div
        v-if="policy !== 'history'"
        class="pa__messages__message pa__pw-policy"
        :style="getPolicyStyle(policy)"
      >
        <span>{{ getStatusIcon(policy) }}</span>
        {{ getPolicyText(policy) }}
      </div>
    </template>
  </div>
</template>