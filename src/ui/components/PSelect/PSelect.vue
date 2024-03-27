<template>
  <div
    ref="inputRef"
    class="pa__input pa__input-select"
    :class="classes"
    tabindex="0"
    @keydown="onKeyDown"
    @click="onClick"
  >
    <div
      ref="containerRef"
      class="pa__input--wrap"
      tabindex="0"
    >
      <label
        v-if="label"
        class="pa__input--label"
      > {{ i18n.t(label) }}
      </label>
      <div
        class="pa__input-select-value"
        v-bind="$attrs"
      >
        {{ getItemText(selectedItem) }}
      </div>
      <svg
        class="pa__input-select-arrow"
        width="10"
        height="5"
        viewBox="0 0 10 5"
        fill-rule="evenodd"
      >
        <title>Open drop down</title>
        <path d="M10 0L5 5 0 0z" />
      </svg>
      <div
        ref="popoverRef"
        class="pa__input-select-items"
      >
        <div
          v-for="(item, ind) in items"
          :key="ind"
          class="pa__input-select-item"
          :class="{'pa__input-select-item--selected': getItemValue(item) === internalValue }"
          @click="onItemClick($event, item)"
        >
          {{ getItemText(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import flip from '@popperjs/core/lib/modifiers/flip';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import type { Instance } from '@popperjs/core/lib/popper-lite';
import type { PropType } from 'vue';
import { inject, watch, computed, reactive, defineComponent, onMounted, ref } from 'vue';

import { makeFocusProps, useFocus } from '../../composables/focus';
import { useProxiedModel } from '../../composables/proxied_model';
import { type Translator, translatorKey } from '../../utils/translator';

export default defineComponent({
  props: {
    modelValue: null,
    label: { type: String  as PropType<string> },
    name: { type: String  as PropType<string> },
    returnObject: { type: Boolean  as PropType<boolean> },
    dense: { type: Boolean as PropType<boolean> },
    flat: { type: Boolean  as PropType<boolean> },
    itemText: { type: String as PropType<string>, default: 'name' },
    itemValue: { type: String as PropType<string>, default: 'value' },
    items: { type: Array as PropType<any[]>, default: () => [] },
    ...makeFocusProps(),
  },
  emits: ['update:modelValue', 'keydown', 'change', 'click'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLElement>(null as any)
    const popoverRef = ref<HTMLElement>(null as any)
    const containerRef = ref<HTMLElement>(null as any)
    const popperInstance = ref<Instance>(null as any);
    const i18n = inject(translatorKey) as Translator

    const internalValue = useProxiedModel(props, 'modelValue')
    const selectedItem = ref<any>()
    const state = reactive({
      open: false
    })
    onMounted(()=>{
      containerRef.value.addEventListener('blur', blur)
      containerRef.value.addEventListener('focus', onFocus)

      popperInstance.value = createPopper(containerRef.value, popoverRef.value, {
        strategy: 'fixed',
        modifiers: [
          {
            ...preventOverflow,
            options: {
              rootBoundary: containerRef.value,
              altBoundary: true,
              padding: 0
            }
          },
          flip,
          {
            ...offset,
            options: {
              offset: [0, 0],
            }
          }
        ],
      });
    })

    watch(internalValue, (val) => {
      selectedItem.value = props.items.find(i => {
        return val === (typeof i === 'object' ? i[props.itemValue] : i)
      })
      emit('update:modelValue', props.returnObject ? selectedItem.value : internalValue.value)
    }, { immediate: true })

    const { blur, focus, focusClasses, isFocused } = useFocus(props, 'pa__input')

    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus()
      }
      if (!isFocused.value) focus()
    }

    const onClick = (e: Event) => {
      state.open = !state.open
      popperInstance.value.update()
      emit('click', e)
    }

    const onBlur = (e: FocusEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if(!(e.target as Element).contains(e.relatedTarget as Element)){
        // @ts-ignore
        state.open = false
        if (isFocused.value) blur()
      }

    }

    const onItemClick = (event: MouseEvent, item) => {
      event.preventDefault()
      event.stopPropagation()
      internalValue.value = getItemValue(item)
      state.open = false
      return
    }
    const onKeyDown =  (e: KeyboardEvent) => {
      if (e.code === '13') emit('change', internalValue.value)

      emit('keydown', e)
    }
    function getItemText(item: string | Record<string, any>){
      return typeof item === 'object' ?  item[props.itemText] : item
    }
    function getItemValue(item: string | Record<string, any>){
      return typeof item === 'object' ?  item[props.itemValue] : item
    }

    const classes = computed(() => ({
      'pa__input-has-value': !!internalValue.value,
      'pa__input-select-is-open': state.open,
      'pa__input-dense': props.dense,
      'pa__input-flat': props.flat,
      ...focusClasses
    }))
    return {
      classes,
      selectedItem,
      onClick,
      containerRef,
      popoverRef,
      inputRef,
      onItemClick,
      onKeyDown,
      onFocus,
      onBlur,
      getItemText,
      internalValue,
      i18n,
      getItemValue
    }
  }
})
</script>

<style src="./PSelect.css">

</style>
