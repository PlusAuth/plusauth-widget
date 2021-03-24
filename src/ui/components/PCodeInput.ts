import { defineComponent, h, computed, ref } from 'vue';

import { PTextField } from '.';


function generateDigitInput(index: any, ref: any, model: any, onUpdate: any,
                            onInput: any){
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
    onFocus($event: FocusEvent){
      const el = $event.target as HTMLInputElement
      if(el.setSelectionRange){
        el.setSelectionRange(el.value.length,el.value.length)
      }

    },
    'onUpdate:modelValue': (val: any) => {
      onInput(index, val)
    },
    onKeypress($event: KeyboardEvent){
      onUpdate(index, $event)
    },
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
  const inputRefs = []
  for (let i = 0; i < size ; i++) {
    inputRefs.push(ref<typeof PTextField>(null as any))
  }
  return inputRefs
}

export default defineComponent({
  name: 'PCodeInput',
  props: {
    size: {
      type: Number as () => number,
      default: 6
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
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
      digits,
      inputRefs,
      onDigitInput(index: number, val: any){
        if (!val) {
          digits[index].value = null
        }
        ctx.emit('update:modelValue', innerModelValue.value)
      },
      onDigitUpdate(index: number, event: KeyboardEvent){
        const value = event.key
        const pressedKey = Number(value)
        if ( event.code.startsWith('Digit')
          || /Numpad\d/gm.test(event.code)) {
          // 0-9 only
          event.preventDefault()
          digits[index].value = String(pressedKey)
          if(index + 1 < props.size){
            inputRefs[index + 1].value.focus()
          }
        }else{
          event.preventDefault()
        }
        ctx.emit('update:modelValue', innerModelValue.value)

      }
    }
  },
  render(){
    return h('div', {
      class: {
        'pa__code-input': true
      }
    }, Array(this.size).fill(0).map((v, i) =>
      generateDigitInput.call(this, i, this.inputRefs[i], this.digits[i], this.onDigitUpdate,
        this.onDigitInput)))
  }
})
