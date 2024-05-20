<script setup lang="ts">
import { computed } from 'vue';

import { useContext, useLocale } from '../composables';
import { useTimer } from '../composables/use_timer.ts';
import { secondsToTime } from '../utils';

withDefaults(defineProps<{
  type?: string
}>(), {
  type: 'common.code'
})

const context = useContext()
const { t } = useLocale()
const resendLink = `${window.location.pathname}/resend`
const resendAfter = context.details.resend_after as number
const { countdown } = useTimer(Math.floor(resendAfter / 1000) || 0)
const formattedTimer = computed(() => {
  return secondsToTime(countdown.value)
})
</script>

<template>
  <div class="pa__resend-action">
    <span
      v-t="['common.resendText', { type }]"
    />
    <span
      v-if="countdown > 0"
    >
      {{ t('common.resendAfter', {time: formattedTimer}) }}
    </span>
    <a
      v-else
      v-t="'common.resend'"
      :href="resendLink"
    />
  </div>
</template>

<style>
.widget {
  .resend-action {
    @apply text-center;

    span:first-of-type {
      @apply pr-2
    }
    span + span  {
      @apply opacity-75
    }
  }
}

</style>
