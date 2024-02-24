<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';

import PlusAuthWidget from '../src';
import type { IPlusAuthContext, IWidgetSettings } from '../src/ui/interfaces';

import { useConfig } from './useConfig';

const props = defineProps<{
  settings: Partial<IWidgetSettings>,
  context?: Partial<IPlusAuthContext>
}>()
const config = ref(useConfig(props.settings, props.context))
const key = ref()
const widget = ref<PlusAuthWidget>()

onMounted(() => {
  widget.value = new PlusAuthWidget('#wrapper', config.value.settings, config.value.context as any)
})
watch(() => props, (value, oldValue) => {
  config.value = useConfig(props.settings, props.context)
  widget.value?._view.unmount()
  widget.value = new PlusAuthWidget('#wrapper', config.value.settings, config.value.context as any)
},{ deep: true })

</script>

<template>
  <div id="wrapper" />
</template>

<style scoped>

</style>
