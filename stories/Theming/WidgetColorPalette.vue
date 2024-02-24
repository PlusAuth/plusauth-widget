<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type { IWidgetSettings } from '../../src/ui/interfaces';
import { createSwatches } from '../../src/ui/utils/theme/theme_utils.ts';

const genColorVariableName = (name: string, variant = 'color'): string => `--pa-${variant}-${name}`

const props = defineProps<IWidgetSettings['theme']>()
const palettes = computed( () => Object.keys(props).reduce((prev, curr) => {
  prev[curr] = {
    name: curr,
    palette: createSwatches(props[curr])
  }
  return prev
}, {} as any) as any)

</script>

<template>
  <div
    v-for="(variant, def ) in palettes"
    :key="def"
    class="pa__palette-definition"
  >
    <label>
      {{ def }}
    </label>
    <div class="pa__palettes">
      <template
        v-for="(palette, index) in variant.palette"
        :key="index"
      >
        <div
          v-if="palette.stop !== 0 && palette.stop !== 1000"
          class="pa__palette"
          :style="{
            background: `rgb(${palette.plainRgb})`,
            color: `rgb(${variant.palette[ index > 6 ? 2 : 11].plainRgb})`
          }"
        >
          {{ palette.stop }}
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.palette-definition {
  @apply font-bold my-4
}
.palettes {
  @apply flex my-2
}
.palette {
  @apply min-h-16 w-24 font-normal p-2
}
</style>
