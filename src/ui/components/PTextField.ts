import { defineComponent, h, resolveDirective,
  vModelDynamic, withDirectives, reactive, toRefs } from 'vue';

import { Colorable , Themeable , Translatable , Validatable } from '../mixins';

import Message from './PMessage';

export default defineComponent({
  name: 'PTextField',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: {
    ...Validatable.props,
    ...Colorable.props,
    type: { type: String, default: 'text' },
    label: String,
    modelValue: { type: null, default: null },
  },
  computed: {
    internalValue: {
      get(): any {
        return this.lazyValue
      },
      set(val: any){
        this.lazyValue = val
        this.$emit('input', val)
      }
    },
    messagesToDisplay(): string[] {
      if (!this.hasMessages) return []

      return this.validations.map((validation: string | any) => {
        if (typeof validation === 'string') return validation

        const validationResult = validation(this.internalValue)

        return typeof validationResult === 'string' ? validationResult : ''
      }).filter((message: any) => message !== '')
    },
  },
  watch: {
    modelValue(value){
      this.lazyValue = value
    }
  },
  setup(props ){

    const state = reactive({
      isFocused: false,
      isActivated: false,
      lazyValue: props.modelValue
    })
    return { ...toRefs(state) }
  },
  render(){
    const vT = resolveDirective('t')
    return h ('div', this.setTextColor(this.validationState, {
      class: {
        'theme--dark': this.theme?.dark,
        'theme--light': !this.theme?.dark,
        'pa__input': true,
        'pa__input-has-state': this.hasState,
        'pa__input-has-value': !!this.modelValue,
        'pa__input-focused': this.isFocused
      },
    }),
    [
      h('div', {
        class: { 'pa__input--wrap': true }
      }, [
        withDirectives(
          h('input', {
            autocomplete: this.$attrs.autocomplete,
            name: this.$attrs.name,
            type: this.type,
            style: this.$attrs.style,
            class: ['pa__text-field'],
            'onFocus': () => {
              // @ts-ignore
              this.hasColor = true
              this.isFocused = true
              this.isActivated = true
            },
            'onBlur': () => {
              // @ts-ignore
              this.hasColor = false
              this.isFocused = false
            },
            'onUpdate:modelValue': (value: any) => {
              this.isActivated = true
              this.$emit('update:modelValue', value)
            }
          }
          ),
          [[vModelDynamic, this.modelValue]]
        ),
        withDirectives(h('label', this.setTextColor(this.validationState,{
          class: { 'pa__input--label': true }
        })),[
          // @ts-ignore
          [vT, this.label]
        ]),
        this.$slots.append ? this.$slots.append(): '',]),
      h(Message, {
        class: 'pa__input-details',
        value: this.messagesToDisplay
      }),

    ])
  }
})
