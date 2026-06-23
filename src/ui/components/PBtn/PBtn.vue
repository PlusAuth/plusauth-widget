<template>
  <component
    ref="btnRef"
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
import { computed, onMounted, ref } from 'vue';

import { resolveCssVariableVariant } from '../../utils';
import PSpinner from '../PSpinner/PSpinner.vue';

const buttonVariants = ['flat', 'elevated', 'tonal', 'outlined', 'text', 'plain'] as const
const btnRef = ref<HTMLElement>();
const buttonVariant = ref<typeof buttonVariants[number]>(
  resolveCssVariableVariant('--pa-button-variant', buttonVariants)
);

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
  [`pa__btn--variant-${buttonVariant.value}`]: true,
}))

onMounted(() => {
  buttonVariant.value = resolveCssVariableVariant('--pa-button-variant', buttonVariants, btnRef.value)
})

const resolveColor = (color: string) => color.startsWith('#') ? color : `rgb(var(--pa-color-${color}))`
const styles = computed(() => ({
  '--pa-btn-color': resolveColor(props.color || 'primary'),
  '--pa-btn-text-color': props.textColor ? resolveColor(props.textColor) : undefined,
  '--pa-ring-color': props.color?.startsWith('#')
    ? `${props.color}4d`
    : `rgb(var(--pa-color-${props.color || 'primary'}) / 0.3)`
}))
</script>
<style src="./PBtn.css"></style>
