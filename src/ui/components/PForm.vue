<template>
  <form
    ref="formElRef"
    class="pa__form"
    novalidate
    @reset="onReset"
    @submit="onSubmit"
  >
    <slot />
  </form>
</template>

<script lang="ts">
import { ref , defineComponent } from 'vue';

import type { SubmitEventPromise } from '../composables/form';
import { createForm , makeFormProps } from '../composables/form';

export default defineComponent({
  props: makeFormProps(),
  emits: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    'update:modelValue': (val: boolean | null) => true,
    submit: (e: SubmitEventPromise) => true,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
  setup(props, { emit, expose }) {
    const form = createForm(props as any)
    const formElRef = ref<HTMLFormElement>()

    function onReset(e: Event) {
      e.preventDefault()
      form.reset()
    }

    function onSubmit(_e: Event) {
      const e = _e as SubmitEventPromise

      const ready = form.validate()
      e.then = ready.then.bind(ready)
      e.catch = ready.catch.bind(ready)
      e.finally = ready.finally.bind(ready)

      emit('submit', e)

      if (!e.defaultPrevented) {
        ready.then(({ valid }) => {
          if (valid) {
            formElRef.value?.submit()
          }
        })
      }

      e.preventDefault()
    }

    expose(form)
    return {
      onReset,
      onSubmit,
      formElRef
    }
  }
})
</script>

<style scoped>

</style>
