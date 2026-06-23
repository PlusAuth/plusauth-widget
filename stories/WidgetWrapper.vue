<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import PlusAuthWidget from '../src';
import type { IPlusAuthContext, IWidgetSettings } from '../src/ui/interfaces';

import { useConfig } from './useConfig';

const props = defineProps<{
  settings: Partial<IWidgetSettings>,
  context?: Partial<IPlusAuthContext>
}>()
const config = ref(useConfig(props.settings, props.context))
const widget = ref<PlusAuthWidget>()
const wrapperId = `wrapper-${Math.random().toString(36).slice(2, 11)}`

const unmountWidget = () => {
  // @ts-expect-error stories need access to the mounted vue app instance.
  widget.value?._view.unmount()
  widget.value = undefined
}

const mountWidget = () => {
  unmountWidget()
  widget.value = new PlusAuthWidget(`#${wrapperId}`, config.value.settings, config.value.context as any)
}

onMounted(mountWidget)
onBeforeUnmount(unmountWidget)

watch(() => [props.settings, props.context], () => {
  config.value = useConfig(props.settings, props.context)
  mountWidget()
},{ deep: true, flush: 'post' })

</script>

<template>
  <div :id="wrapperId" />
</template>

<style>
</style>
