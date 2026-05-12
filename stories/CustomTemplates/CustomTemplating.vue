<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import PlusAuthWidget from '../../src';
import type { IPlusAuthContext, IWidgetSettings } from '../../src/ui/interfaces';

import { useConfig } from '../useConfig';

const props = defineProps<{
  template: string
  settings: Partial<IWidgetSettings>,
  context?: Partial<IPlusAuthContext>
}>()
const config = ref(useConfig(props.settings || {}, props.context))
const widget = ref<PlusAuthWidget>()
const wrapperRef = ref<HTMLElement>()
const wrapperId = `wrapper-${Math.random().toString(36).slice(2, 11)}`

const unmountWidget = () => {
  // @ts-expect-error stories need access to the mounted vue app instance.
  widget.value?._view.unmount()
  widget.value = undefined
}

const mountWidget = async () => {
  await nextTick()
  if (!wrapperRef.value) return

  unmountWidget()
  wrapperRef.value.innerHTML = props.template
  widget.value = new PlusAuthWidget(`#${wrapperId}`, config.value.settings || {}, config.value.context as any)
}

onMounted(mountWidget)
onBeforeUnmount(unmountWidget)

watch(() => [props.template, props.settings, props.context], () => {
  config.value = useConfig(props.settings, props.context)
  mountWidget()
},{ deep: true, flush: 'post' })

</script>

<template>
  <div
    :id="wrapperId"
    ref="wrapperRef"
  />
</template>

<style scoped>

</style>
