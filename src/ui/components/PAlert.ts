import { defineComponent, h, PropType } from 'vue';

import { Colorable, Themeable } from '../mixins';

export default defineComponent({
  name: 'PAlert',
  mixins: [Colorable, Themeable],
  props: {
    ...Colorable.props,
    type: {
      type: String as PropType<'info' | 'error' | 'success' | 'warning'>,
      default: 'error'
    },
    text: { type: Boolean as PropType<boolean>, default: false },
    tile: { type: Boolean as PropType<boolean>, default: false },
    dismissible: { type: Boolean as PropType<boolean>, default: false },
    modelValue: { type: Boolean as PropType<boolean>, default: true }
  },
  emits: ['update:modelValue'],
  render(){
    return this.modelValue &&  h('div',this.setBackgroundColor(
      this.type,
      this.setTextColor(this.text ? this.type : this.textColor, {
        class: {
          'pa__alert': true,
          'pa__alert--text': this.text,
          'pa__alert--tile': this.tile,
        }
      })),[this.$slots.default ? this.$slots.default(): null])
  }
})
