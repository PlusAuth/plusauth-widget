<script setup lang="ts">
import { ref } from 'vue';

import type { SubmitEventPromise } from '../composables/form';
import { createForm, makeFormProps } from '../composables/form';

const props = defineProps(makeFormProps());

const emit = defineEmits<{
  'update:modelValue': [val: boolean | null];
  submit: [e: SubmitEventPromise];
}>();

const form = createForm(props as any);
const formElRef = ref<HTMLFormElement>();

function onReset(e: Event) {
  e.preventDefault();
  form.reset();
}

function onSubmit(_e: Event) {
  const e = _e as SubmitEventPromise;

  const ready = form.validate();
  e.then = ready.then.bind(ready);
  e.catch = ready.catch.bind(ready);
  e.finally = ready.finally.bind(ready);

  emit('submit', e);

  if (!e.defaultPrevented) {
    ready.then(({ valid }) => {
      if (valid) {
        formElRef.value?.submit();
      }
    });
  }

  e.preventDefault();
}

defineExpose(form);
</script>

<template>
  <form
    ref="formElRef"
    class="pa__form"
    novalidate
    :disabled="disabled"
    @reset="onReset"
    @submit="onSubmit"
  >
    <slot />
  </form>
</template>

<style scoped>
</style>