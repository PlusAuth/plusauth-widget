import type { ComponentPublicInstance } from 'vue';
import { defineComponent, h } from 'vue';


import { Colorable, Themeable } from '../mixins';

import Loading from './PLoading';

function getContent(this: ComponentPublicInstance<any>){
  const defaultSlot = this.$slots.default ? this.$slots.default(): ''
  return typeof defaultSlot === 'string' ?
    h('span', defaultSlot) : defaultSlot
}
export default defineComponent({
  name: 'PBtn',
  mixins: [Colorable, Themeable],
  props: {
    ...Colorable.props,
    loading: { type: Boolean },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    flat: { type: Boolean, default: false }
  },
  render(){
    const genLoader = () => {
      return h('span', {
        class: 'pa__btn__loader',
      },
      (this.$slots.loader ? this.$slots.loader() : false) || [
        h(Loading, {
          color: this.textColor,
          indeterminate: true,
          size: 23,
          width: 2,
        })
      ])
    }
    return h('button',
      this.setBackgroundColor(this.color, {
        ...this.$attrs,
        class: {
          'pa__btn': true,
          'pa__btn--loading': !!this.loading,
          'pa__btn--block': this.block,
          'pa__btn--disabled': this.disabled,
          'pa__btn--flat': this.flat
        },
      }),
      [
        this.loading ? genLoader() :

          h('div',
            this.setTextColor(this.textColor,{
              class: ['pa__btn__content']
            }),
            [getContent.call(this)]
          )
      ])
  }
})
