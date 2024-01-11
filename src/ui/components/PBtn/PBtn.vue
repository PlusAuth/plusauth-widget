<template>
  <component
    :is="$attrs.href ? 'a' : 'button'"
    :class="classes"
    :style="styles"
    :type="$attrs.type || 'button'"
  >
    <div
      v-if="loading"
      class="pa__btn__loader"
    >
      <PSpinner
        :color="textColor"
        indeterminate
        :size="24"
        :width="2"
      />
    </div>
    <slot />
  </component>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { setColorStyle } from '../../utils';
import PSpinner from '../PSpinner/PSpinner';

const props = defineProps<{
  block?: boolean,
  disabled?: boolean,
  flat?: boolean,
  textColor?: string;
  loading?: boolean,
  color?: string
}>()

const classes = computed(() => ({
  'pa__btn': true,
  'pa__btn--loading': props.loading,
  'pa__btn--block': props.block,
  'pa__btn--disabled': props.disabled,
  'pa__btn--flat': props.flat,
}))
const styles = computed(() => ({
  ...setColorStyle(props),
  '--pa-ring-color': `rgb(var(--pa-color-${props.color}-DEFAULT) / 0.3)`
}))
</script>
<style src="./PBtn.css"></style>
