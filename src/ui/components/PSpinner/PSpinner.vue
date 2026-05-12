<script setup lang="ts">
import { computed } from 'vue';

import './PSpinner.css';
import { convertToUnit } from '../../utils';

const RADIUS = 20;

const props = withDefaults(defineProps<{
  button?: boolean;
  indeterminate?: boolean;
  rotate?: number | string;
  color?: string;
  size?: number | string;
  width?: number | string;
  modelValue?: number | string;
}>(), {
  rotate: 0,
  size: 32,
  width: 4,
  modelValue: 0
});

const calculatedSize = computed(() => {
  return Number(props.size) + (props.button ? 8 : 0);
});

const circumference = computed(() => {
  return 2 * Math.PI * RADIUS;
});

const strokeDashArray = computed(() => {
  return Math.round(circumference.value * 1000) / 1000;
});

const strokeDashOffset = computed(() => {
  return Math.round(circumference.value * 1000) / 1000;
});

const viewBoxSize = computed(() => {
  return RADIUS / (1 - Number(props.width) / +props.size);
});

const strokeWidth = computed(() => {
  return Number(props.width) / +props.size * viewBoxSize.value * 2;
});

const styles = computed(() => ({
  height: convertToUnit(calculatedSize.value),
  width: convertToUnit(calculatedSize.value),
}));

const svgStyles = computed(() => ({
  transform: `rotate(${Number(props.rotate)}deg)`,
}));

const normalizedValue = computed(() => {
  const val = Number(props.modelValue);
  if (isNaN(val) || val < 0) return 0;
  return val > 100 ? 100 : val;
});

const classes = computed(() => ({
  'pa__progress-circular': true,
  ...props.color ? { [`text-${props.color}`]: true } : {},
  'pa__progress-circular--indeterminate': props.indeterminate,
  'pa__progress-circular--button': props.button,
}));
</script>

<template>
  <div
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    :class="classes"
    :style="styles"
  >
    <svg
      :style="svgStyles"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`"
    >
      <circle
        v-if="!indeterminate"
        class="pa__progress-circular__underlay"
        fill="transparent"
        :cx="2 * viewBoxSize"
        :cy="2 * viewBoxSize"
        :r="RADIUS"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArray"
        stroke-dashoffset="0"
      />
      <circle
        class="pa__progress-circular__overlay"
        fill="transparent"
        :cx="2 * viewBoxSize"
        :cy="2 * viewBoxSize"
        :r="RADIUS"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArray"
        :stroke-dashoffset="strokeDashOffset"
      />
    </svg>
    <div class="pa__progress-circular__info">
      <slot />
    </div>
  </div>
</template>