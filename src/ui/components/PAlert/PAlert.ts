import type { PropType } from 'vue';
import { defineComponent, h, Transition, watchEffect } from 'vue';

import './PAlert.css'
import { setColorStyle } from '../../utils';

export type PAlertProps = {
  color: string,
  textColor: string,
  type: 'info' | 'error' | 'success' | 'warning',
  text: boolean,
  tile: boolean,
  timeout: number| string
}
export default defineComponent({
  name: 'PAlert',
  props: {
    modelValue: { type: Boolean as PropType<boolean>, default: true },
    type: { type: String as PropType<PAlertProps['type']>, default: 'error' },
    text: { type: Boolean as PropType<PAlertProps['text']>, default: false },
    textColor: { type: String as PropType<string>, default: '#fff' },
    tile: { type: Boolean as PropType<PAlertProps['tile']>, default: false },
    timeout: { type: Number as PropType<PAlertProps['timeout']>, default: 0 }
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
    let closeTimeout: any
    watchEffect( () => {
      if(props.modelValue && props.timeout){
        const timeoutVal = Number(props.timeout)
        if(closeTimeout){
          clearTimeout(closeTimeout)
        }
        closeTimeout = setTimeout(()=> {
          ctx.emit('update:modelValue', false)
        }, timeoutVal)
      }
    })
  },
  render() {
    return h(Transition,
      { name: 'pa__message-transition', css: true },
      {
        default: () => this.modelValue && h('div',
          {
            style: {
              ...setColorStyle(
                this.text
                  ? { textColor: this.textColor || this.type }
                  : { color: this.type, textColor: this.textColor }
              )
            },
            class: {
              'pa__alert': true,
              'pa__alert--text': this.text,
              'pa__alert--tile': this.tile,
            }
          },
          h('div', { class: 'pa__alert-content' }, [
            this.$slots.default ? this.$slots.default() : null,
          ])
        )
      }
    )
  }
})
