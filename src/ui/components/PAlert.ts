import { defineComponent, h, PropType, Transition } from 'vue';

import { Colorable, Themeable } from '../mixins';

import PIcon from './PIcon';

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
  render() {
    return h(Transition,
      { name: 'pa__message-transition', css: true },
      {
        default: () => this.modelValue && h('div', this.setBackgroundColor(this.type,
          this.setTextColor(this.text ? this.type : this.textColor, {
            class: {
              'pa__alert': true,
              'pa__alert--text': this.text,
              'pa__alert--tile': this.tile,
            }
          })
        ),
        h('div', { class: 'pa__alert-content' }, [
          this.$slots.default ? this.$slots.default() : null,
          this.dismissible && h(PIcon, {
            onClick: () => {
              this.$emit('update:modelValue', false)
            },
            class: 'pa__alert-dismiss-icon',
            color: this.text ? this.color : this.textColor
          }, 'pa__close')
        ])
        )
      }
    )
  }
})
