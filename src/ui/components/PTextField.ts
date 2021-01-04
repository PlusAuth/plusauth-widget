import { defineComponent, h, withDirectives, reactive, toRefs, ref } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable , Themeable , Translatable , Validatable } from '../mixins';

import Message from './PMessage';

export default defineComponent({
  name: 'PTextField',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: {
    ...Validatable.props,
    ...Colorable.props,
    type: { type: String, default: 'text' },
    label: { type: String, default: null },
    modelValue: { type: null, default: null },
    hideMessages: { type: Boolean, default: false }
  },
  emits: ['focus', 'keydown', 'change', 'input', 'update:modelValue', 'blur', 'update:error'],
  setup(props){
    const inputRef = ref<string>(null as any)
    const state = reactive({
      isFocused: false,
      isActivated: false,
      lazyValue: props.modelValue
    })
    return {
      ...toRefs(state),
      inputRef,
    }
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
        if (typeof validation === 'string' || validation?.constructor === Object) return validation
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
  methods: {
    reset(){
      this.internalValue = null
    },
    focus(){
      // @ts-ignore
      this.$refs.inputRef.focus()
    },
  },
  render(){
    const onFocus = (e: FocusEvent) => {
      // @ts-ignore
      this.hasColor = true
      this.isFocused = true
      this.isActivated = true
      this.$emit('focus', e)
    }

    const onBlur = (e: FocusEvent) => {
      // @ts-ignore
      this.hasColor = false
      this.isFocused = false
      this.$emit('blur', e)
    }
    const onInput = (event: InputEvent) => {
      this.isActivated = true
      this.$emit('update:modelValue', (event.currentTarget as HTMLInputElement)?.value)
    };
    const onKeyDown =  (e: KeyboardEvent) => {
      if (e.code === '13') this.$emit('change', this.internalValue)

      this.$emit('keydown', e)
    }
    return h ('div',
      this.setTextColor(this.validationState, {
        class: {
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
          h('input', Object.assign({},this.$attrs,{
            value: this.internalValue,
            ref: 'inputRef',
            name: this.$attrs.name,
            type: this.type || 'text',
            style: this.$attrs.style,
            class: ['pa__text-field'],
            onKeyPress: this.$attrs.onKeyPress,
            onFocus,
            onBlur,
            onInput,
            onKeyDown
          })
          ),
          this.label ?
            withDirectives(h('label', this.setTextColor(this.validationState,{
              class: { 'pa__input--label': true }
            })),[
              [i18n, this.label]
            ]) : '',
          this.$slots.append ? this.$slots.append(): '',
        ]),
        !this.hideMessages ? this.$slots.message ? this.$slots.message({
          message: this.messagesToDisplay,
          hasState: this.hasState,
          focus: this.isFocused
        }) : h(Message, {
          class: 'pa__input-details',
          value: this.messagesToDisplay,
          field: this.$attrs.name
        }): null,

      ])
  }
})
