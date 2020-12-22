import { defineComponent, h, reactive, ref, toRefs, withDirectives } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable, Themeable, Translatable, Validatable } from '../mixins';

import Message from './PMessage';

export default defineComponent({
  name: 'PCheckBox',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: {
    ...Validatable.props,
    ...Colorable.props,
    ...Themeable.props,
    label: { type: String, default: null },
    modelValue: { type: null, default: null },
    hideMessages: { type: Boolean, default: false }
  },
  emits: ['focus', 'change', 'input', 'update:modelValue', 'blur', 'update:error'],
  setup(props){
    const inputRef = ref<string>(null as any)
    const state = reactive({
      isChecked: props.modelValue,
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
      this.isChecked = value
      this.lazyValue = value
    }
  },
  render() {
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
      this.$emit('update:modelValue', !this.modelValue)
    };
    return h('div',
      this.setTextColor(this.validationState, {
        class: {
          'pa__input': true,
          'pa__input-checkbox': true,
          'pa__input-has-state': this.hasState,
          'pa__input-has-value': !!this.modelValue,
          'pa__input-focused': this.isFocused
        },
      }), [
        h('div',
          {
            class: ['pa__input--wrap']
          },
          [
            h(
              'input',
              this.setTextColor( this.isChecked ? this.computedColor : this.validationState,
                Object.assign({},this.$attrs,{
                  value: this.modelValue,
                  ref: 'inputRef',
                  name: this.$attrs.name,
                  type: 'checkbox',
                  style: this.$attrs.style,
                  onKeyPress: this.$attrs.onKeyPress,
                  onFocus,
                  onBlur,
                  onInput
                }))
            ),
            this.label ?
              withDirectives(h('label', this.setTextColor(this.validationState,{
                class: { 'pa__input--label': true }
              })),[
                [i18n, this.label]
              ]) : '',
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
      ]
    )
  },
})
