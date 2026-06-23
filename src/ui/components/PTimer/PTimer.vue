<script setup lang="ts">
import { useTimer } from '../../composables/use_timer.ts';
import './PTimer.css';

const props = withDefaults(defineProps<{
  duration?: number;
}>(), {
  duration: 0
});

const { countdown } = useTimer(props.duration);
</script>

<template>
  <div
    class="pa__timer--circle"
    :style="{ borderColor: countdown > 0 ? 'orange' : 'red' }"
  >
    <span class="pa__timer--seconds">
      {{ countdown || 0 }}
    </span>
  </div>
</template>