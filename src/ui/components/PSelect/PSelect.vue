<script lang="ts">
import {
  computePosition,
  flip,
  offset,
  shift,
  autoUpdate
} from '@floating-ui/dom'
import type { PropType } from 'vue'
import {
  nextTick,
  inject,
  watch,
  computed,
  reactive,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue'

import { makeFocusProps, useFocus } from '../../composables/focus'
import { useProxiedModel } from '../../composables/proxied_model'
import { type Translator, translatorKey } from '../../utils/translator'

export default defineComponent({
  props: {
    modelValue: null,
    label: { type: String as PropType<string> },
    name: { type: String as PropType<string> },
    returnObject: { type: Boolean as PropType<boolean> },
    dense: { type: Boolean as PropType<boolean> },
    flat: { type: Boolean as PropType<boolean> },
    itemText: { type: String as PropType<string>, default: 'name' },
    itemValue: { type: String as PropType<string>, default: 'value' },
    items: { type: Array as PropType<any[]>, default: () => [] },
    ...makeFocusProps(),
  },
  emits: ['update:modelValue', 'keydown', 'change', 'click'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLElement | null>(null)
    const containerRef = ref<HTMLElement | null>(null)
    const popoverRef = ref<HTMLElement | null>(null)

    const cleanupAutoUpdate = ref<(() => void) | null>(null)

    const i18n = inject(translatorKey) as Translator
    const internalValue = useProxiedModel(props, 'modelValue')
    const selectedItem = ref<any>()

    const state = reactive({ open: false })

    const { blur, focus, focusClasses, isFocused } = useFocus(props, 'pa__input')

    async function updatePosition() {
      if (!containerRef.value || !popoverRef.value) return

      const { x, y } = await computePosition(
        containerRef.value,
        popoverRef.value,
        {
          strategy: 'fixed',
          middleware: [
            offset(0),
            flip(),
            shift({ padding: 0 })
          ]
        }
      )

      Object.assign(popoverRef.value.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    }

    onMounted(() => {
      containerRef.value?.addEventListener('blur', blur)
      containerRef.value?.addEventListener('focus', onFocus)
    })

    onBeforeUnmount(() => {
      cleanupAutoUpdate.value?.()
    })

    watch(() => state.open, async (isOpen) => {
      cleanupAutoUpdate.value?.()
      cleanupAutoUpdate.value = null

      if (isOpen) {
        await nextTick()
        await updatePosition()

        cleanupAutoUpdate.value = autoUpdate(
          containerRef.value!,
          popoverRef.value!,
          updatePosition
        )

        nextTick(() => {
          activate(
            popoverRef.value?.querySelector(
              '.pa__input-select-item--selected'
            )
          )
        })
      } else {
        popoverRef.value
          ?.querySelectorAll('.pa__input-select-item[tabindex="0"]')
          .forEach((el) => (el as HTMLElement).tabIndex = -1)
      }
    })

    watch(internalValue, (val) => {
      selectedItem.value = props.items.find(i =>
        val === (typeof i === 'object' ? i[props.itemValue] : i)
      )

      emit(
        'update:modelValue',
        props.returnObject ? selectedItem.value : internalValue.value
      )
    }, { immediate: true })

    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus()
      }
      if (!isFocused.value) focus()
    }

    function onClick(e: Event) {
      state.open = !state.open
      emit('click', e)
    }

    function onBlur(e: FocusEvent) {
      e.preventDefault()
      e.stopPropagation()

      if (!inputRef.value?.contains(e.relatedTarget as Element)) {
        state.open = false
        if (isFocused.value) blur()
      }
    }

    function onItemClick(event: Event, item: any) {
      event.preventDefault()
      event.stopPropagation()
      internalValue.value = getItemValue(item)
      state.open = false
    }

    function activate(item?: HTMLElement | null) {
      if (!item || !popoverRef.value) return

      popoverRef.value
        .querySelectorAll('.pa__input-select-item')
        .forEach((el) => (el as HTMLElement).tabIndex = -1)

      item.tabIndex = 0
      nextTick(() => item.focus())
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        state.open = true
      } else if (e.code === '13') {
        emit('change', internalValue.value)
      } else if (e.key === 'ArrowDown') {
        if (!state.open) {
          state.open = true
        } else {
          activate(
            popoverRef.value?.querySelector(
              '.pa__input-select-item[tabindex="0"]'
            )?.nextElementSibling as HTMLElement
          )
        }
      } else if (e.key === 'ArrowUp') {
        if (!state.open) {
          state.open = true
        } else {
          activate(
            popoverRef.value?.querySelector(
              '.pa__input-select-item[tabindex="0"]'
            )?.previousElementSibling as HTMLElement
          )
        }
      }

      emit('keydown', e)
    }

    function getItemText(item: any) {
      return typeof item === 'object'
        ? item[props.itemText]
        : item
    }

    function getItemValue(item: any) {
      return typeof item === 'object'
        ? item[props.itemValue]
        : item
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
      getItemValue,
      internalValue,
      i18n
    }
  }
})
</script>
<template>
  <div
    ref="inputRef"
    class="pa__input pa__input-select"
    :class="classes"
    tabindex="0"
    @keydown="onKeyDown"
    @click="onClick"
    @blur="onBlur"
  >
    <div
      ref="containerRef"
      class="pa__input--wrap"
    >
      <label
        v-if="label"
        class="pa__input--label"
      > {{ i18n.t(label) }}
      </label>
      <slot name="prepend"></slot>
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
          :tabindex="-1"
          class="pa__input-select-item"
          :class="{'pa__input-select-item--selected': getItemValue(item) === internalValue }"
          @blur="onBlur"
          @click="onItemClick($event, item)"
          @keydown.enter="onItemClick($event, item)"
        >
          {{ getItemText(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./PSelect.css">

</style>
