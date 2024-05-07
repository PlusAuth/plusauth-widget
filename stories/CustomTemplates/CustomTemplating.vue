<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';

import PlusAuthWidget from '../../src';
import type { IPlusAuthContext, IWidgetSettings } from '../../src/ui/interfaces';

import { useConfig } from '../useConfig';

const props = defineProps<{
  template: string
  settings: Partial<IWidgetSettings>,
  context?: Partial<IPlusAuthContext>
}>()
const config = ref(useConfig(props.settings || {}, props.context))
const key = ref()
const widget = ref<PlusAuthWidget>()
const inst = getCurrentInstance()
onMounted(() => {
  widget.value = new PlusAuthWidget('#wrapper', config.value.settings || {}, config.value.context as any)
})
watch(() => props, () => {
  config.value = useConfig(props.settings, props.context)
  // @ts-expect-error
  widget.value?._view.unmount()
  inst.vnode.el.innerHTML = props.template
  nextTick(() => {
    widget.value = new PlusAuthWidget('#wrapper', config.value.settings, config.value.context as any)
  })
},{ deep: true })

</script>

<template>
  <div
    id="wrapper"
    :key="props.template"
    v-html="template"
  />
</template>

<style scoped>

</style>
