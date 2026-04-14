import type { Ref } from 'vue';
import { inject , defineComponent, h, computed, ref } from 'vue';

import { PTextField } from '..';
import './PCodeInput.css'
import { type Translator, translatorKey } from '../../utils/translator';

function generateDigitInput(index: any,
                            ref: any,
                            model: any,
                            onInput: any,
                            onKeyDown: any
){
  return  h(PTextField, {
    modelValue: model.value,
    key: index,
    type: 'tel',
    ref,
    hideMessages: true,
    rules: [
      (v: any) => !!v
    ],
    class: {
      'pa__code-input--digit-box': true
    },
    onPaste(e){
      e.preventDefault()
    },
    onKeypress(e){
      // do not prevent submit
      if(e.key !== 'Enter'){
        e.preventDefault()
      }
    },
    onFocus(e: FocusEvent){
      const el = e.target as HTMLInputElement
      setTimeout(() => {
        if(el.setSelectionRange){
          el.setSelectionRange(0,el.value.length)
        }
      })
    },
    'onUpdate:modelValue': (val: any) => {
      onInput(index, val)
    },
    onKeydownCapture(e: KeyboardEvent){
      onKeyDown(index, e)
    }
  })
}

function initializeDigitsModel(size: number) {
  const digits = {}
  for (let i = 0; i < size ; i++) {
    digits[i] = ref(null)
  }
  return digits
}
function initializeInputRefs(size: number) {
  const inputRefs = [] as Ref<typeof PTextField>[]
  for (let i = 0; i < size ; i++) {
    inputRefs.push(ref<typeof PTextField>(null as any))
  }
  return inputRefs
}

export default defineComponent({
  name: 'PCodeInput',
  props: {
    label: {
      type: String
    },
    size: {
      type: Number as () => number,
      default: 6
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
    const i18n = inject(translatorKey) as Translator
    const digits = initializeDigitsModel(props.size)
    const inputRefs = initializeInputRefs(props.size)
    const innerModelValue = computed(() => {
      return Object.keys(digits).reduce((p, c) => {
        if(digits[c].value !== null){
          p = p + digits[c].value
        }

        return p
      }, '')
    })
    return {
      i18n,
      digits,
      inputRefs,
      onDigitInput(index: number, val: any){
        if (!val || isNaN(Number(val)) ) {
          digits[index].value = null
        }
        ctx.emit('update:modelValue', innerModelValue.value)
      },
      onKeydown(index: number, event: KeyboardEvent){
        event.stopPropagation()
        const value = event.key
        if(value === 'Tab' || value === 'Enter'){
          return
        }
        if(value === 'Backspace') {
          if(index !== 0){
            setTimeout(() => {
              digits[index-1].value = null
              inputRefs[index - 1].value.focus()
            })
          }
        } else if(value === 'Delete') {
          if(index !== props.size){
            setTimeout(() => {
              digits[index+1].value = null
              inputRefs[index + 1].value.focus()
            })
          }
        } else if(value.startsWith('Arrow')) {
          const direction = value.replace('Arrow', '').toLowerCase()
          if(direction === 'left' || direction === 'up' ){
            if(index !== 0){
              inputRefs[index - 1].value.focus()
            }
          } else if(direction === 'right'  || direction === 'down' ){
            if( index + 1 !== props.size){
              inputRefs[index + 1].value.focus()
            }
          }
        } else if ( /[0-9]/.test(value) ) {
          event.preventDefault()
          const pressedKey = Number(value)
          digits[index].value = String(pressedKey)
          if(index + 1 < props.size){
            inputRefs[index + 1].value.focus()
          }
        }
        ctx.emit('update:modelValue', innerModelValue.value)
      }
    }
  },
  render(){
    return h('div', { class: 'pa__input pa__code-input' }, [
      this.label ? h('label', { class: 'pa__input--label' }, [
        this.i18n.t(this.label)
      ]) : undefined,
      h('div',
        {
          class: {
            'pa__input--wrap': true
          }
        },
        Array(this.size).fill(0).map((v, i) =>
          generateDigitInput.call(
            this, i,
            this.inputRefs[i],
            this.digits[i],
            this.onDigitInput,
            this.onKeydown,
          )
        )
      )
    ])
  }
})
