import { ComponentPublicInstance } from '@vue/runtime-core';
import { defineComponent, h } from 'vue';

import { Colorable, Themeable, Translatable, Validatable } from '../mixins';

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
    block: { type: Boolean, default: false },
    flat: { type: Boolean, default: false }
  },
  methods: {
    genLoader(){
      return h('span', {
        class: 'pa__btn__loader',
      },
      (this.$slots.loader ? this.$slots.loader() : false) || [
        h(Loading, {
          indeterminate: true,
          size: 23,
          width: 2,
        })
      ])
    }
  },
  render(){
    return h('button',
      this.setBackgroundColor(this.color, {
        ...this.$attrs,
        class: {
          'pa__btn': true,
          'pa__size--default': true,
          'pa__btn--loading': !!this.loading,
          'pa__btn--block': this.block,
          'pa__btn--flat': this.flat
        },
      }),
      [
        this.loading ? this.genLoader() :

          h('div',
            this.setTextColor(this.textColor,{
              class: ['pa__btn__content', 'pa__size--default']
            }),
            [getContent.call(this)]
          )
      ])
  }
})
