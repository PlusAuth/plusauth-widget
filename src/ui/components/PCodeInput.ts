import {
  defineComponent, h, VNode,
  reactive, computed, getCurrentInstance, ref, withDirectives, vModelText,
  nextTick,
  watch
} from 'vue';


function generateDigitInput(index: any, model: any, onUpdate: any,
                            onInput: any){
  return withDirectives(
    h('input', {
      key: index,
      type: 'tel',
      class: {
        'pa__code-input--digit-box': true
      },
      onFocus($event: FocusEvent){
        const el = $event.target as HTMLInputElement
        if(el.setSelectionRange)
          el.setSelectionRange(0,-1)
      },
      'onUpdate:modelValue': (val: any) => {
        onInput(index, val)
      },
      onKeyPress($event: KeyboardEvent){
        onUpdate(index, $event)
      },
    }) ,[[vModelText, model]]
  )
}

function initializeDigitsModel(size: number) {
  const digits = {}
  for (let i = 0; i < size ; i++) {
    digits[i] = ref(null)
  }
  return digits
}
export default defineComponent({
  name: 'PCodeInput',
  props: {
    size: {
      type: Number as () => number,
      default: 6
    }
  },
  setup(props, ctx){
    const vm = getCurrentInstance()
    const digits = initializeDigitsModel(props.size)
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
      onDigitInput(index: number, val: any){
        const valueChars = val.toString();
        if(val){
          const focusIndex =index + valueChars.length < props.size ?
            index + valueChars.length : props.size -1
          for (let i = 0; i < valueChars.length; i++) {
            if (index + i < props.size) {
              digits[index + i].value = valueChars[i]
              // @ts-ignore
              vm.vnode.el.children[index + i].value = valueChars[i]
            }
          }
          vm?.vnode.el?.children[focusIndex ].focus()
        }else{
          digits[index].value = 0
          // @ts-ignore
          vm.vnode.el.children[index].value = digits[index].value
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
          digits[index].value = pressedKey
          // @ts-ignore
          vm.vnode.el.children[index].value = pressedKey
          const focusIndex =index + 1 < props.size ? index + 1 : props.size - 1
          vm?.vnode.el?.children[focusIndex].focus()
        }else{
          event.preventDefault()
        }
        ctx.emit('update:modelValue', innerModelValue.value)

      }
    }
  },
  render(){
    const digitInputs: VNode[] = []
    for (let i =0; i< this.size; i++){
      digitInputs.push(
        generateDigitInput.call(this, i, this.digits[i], this.onDigitUpdate,
          this.onDigitInput)
      )
    }
    return h('div', {
      class: {
        'pa__code-input': true
      }
    }, digitInputs)
  }
})
