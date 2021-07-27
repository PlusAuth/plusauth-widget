import flip from '@popperjs/core/lib/modifiers/flip';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import { createPopper, Instance } from '@popperjs/core/lib/popper-lite';
import { defineComponent, h, withDirectives, reactive, toRefs, ref, onMounted } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable , Themeable , Translatable , Validatable } from '../mixins';

import Message from './PMessage';
export default defineComponent({
  name: 'PSelect',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  emits: [
    'click','focus', 'keydown',
    'change', 'input', 'update:modelValue', 'blur', 'update:error'
  ],
  props: {
    ...Validatable.props,
    ...Colorable.props,
    dense: { type: Boolean as () => boolean, default: false },
    flat: { type: Boolean as () => boolean, default: false },
    label: { type: String as () => string, default: null },
    items: { type: Array as () => any[] , default: () => [] },
    itemText: { type: String as () => string, default: 'name' },
    itemValue: { type: String as () => string, default: 'value' },
    modelValue: { type: null, default: null },
    hideMessages: { type: Boolean, default: false }
  },
  setup(props){
    const inputRef = ref<string>(null as any)
    const popoverRef = ref<HTMLElement>(null as any)
    const containerRef = ref<Element>(null as any)
    const popperInstance = ref<Instance>(null as any);
    onMounted(()=>{
      popperInstance.value = createPopper(containerRef.value, popoverRef.value, {
        strategy: 'fixed',
        modifiers: [
          {
            name: 'matchReferenceSize',
            enabled: true,
            fn: ({ state, instance }) => {
              const widthOrHeight =
                state.placement.startsWith('left') ||
                state.placement.startsWith('right')
                  ? 'height'
                  : 'width';
              const popperSize = state.rects.popper[widthOrHeight];
              const referenceSize = state.rects.reference[widthOrHeight];
              console.log(popperSize, referenceSize)
              if (popperSize >= referenceSize) return;

              state.styles.popper[widthOrHeight] = `${referenceSize}px`;
              // instance.update();
            },
            phase: 'beforeWrite',
            requires: ['computeStyles']
          },
          {
            ...preventOverflow,
            options: {
              rootBoundary: containerRef.value,
              altBoundary: true,
              padding: 0
            }
          },
          flip,
          {
            ...offset,
            options: {
              offset: [0, 0],
            }
          }
        ],
      });
    })
    const state = reactive({
      isOpen: false,
      isFocused: false,
      isActivated: false,
      lazyValue: null,
      selectedItem: null
    })
    return { ...toRefs(state),
      inputRef,
      popoverRef,
      containerRef,
      popperInstance
    }
  },
  computed: {
    internalValue: {
      get(): any {
        return this.lazyValue
      },
      set(val: any){
        this.lazyValue = val
        this.$emit('update:modelValue', val)
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
    },
    lazyValue(val){
      this.selectedItem = this.items.find((item: string | Record<string, any>) => {
        if(typeof item === 'object'){
          return item[this.itemValue] === val
        }
        return item === val
      })
    }
  },
  methods: {
    getText(item: string | Record<string, any>){
      return typeof item === 'object' ?  item[this.itemText] : item
    },
    getValue(item: string | Record<string, any>){
      return typeof item === 'object' ?  item[this.itemValue] : item
    },
    genIcon(){
      return h('svg', {
        class: 'pa__input-select-arrow',
        width: '10',
        height: '5',
        viewBox: '0 0 10 5',
        'fill-rule': 'evenodd'
      }, [
        h('title', null, 'Open drop down'),
        h('path', { d: 'M10 0L5 5 0 0z' })
      ])
    },
    genItems(){
      return h(
        'div',
        {
          ref: 'popoverRef',
          class: {
            'pa__input-select-items': true
          },
        },
        this.items.map( (item: any, i: number) => {
          const itemValue = this.getValue(item)
          return h('div', {
            key: i,
            onClick: (event: Event) => {
              event.preventDefault()
              event.stopPropagation()
              this.internalValue = itemValue
              this.isOpen = false
              this.selectedItem = item
              this.$emit('update:modelValue', this.internalValue)
              return
            },
            tabindex: -1,
            class: {
              'pa__input-select-item': true,
              'pa__input-select-item--selected': itemValue === this.internalValue
            },
          },
          [this.getText(item)]
          )
        })
      )
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
      // this.isOpen = true
      this.isActivated = true
      this.$emit('focus', e)
    }

    const onClick = (e: Event) => {
      // @ts-ignore
      this.hasColor = true
      this.isFocused = true
      this.isActivated = true
      this.isOpen = !this.isOpen
      this.popperInstance.update()
      this.$emit('click', e)
    }

    const onBlur = (e: FocusEvent) => {
      this.isFocused = false
      e.preventDefault()
      e.stopPropagation()
      if(!(e.target as Element).contains(e.relatedTarget as Element)){
        // @ts-ignore
        this.hasColor = false
        this.isOpen = false
        this.$emit('blur', e)
      }

    }
    const onKeyDown =  (e: KeyboardEvent) => {
      if (e.code === '13') this.$emit('change', this.internalValue)

      this.$emit('keydown', e)
    }
    return h ('div',
      this.setTextColor(this.validationState, {
        class: {
          'pa__input': true,
          'pa__input-select': true,
          'pa__input-has-state': this.hasState,
          'pa__input-dense': this.dense,
          'pa__input-flat': this.flat,
          'pa__input-has-value': !!this.internalValue,
          'pa__input-select-is-open': this.isOpen,
          'pa__input-focused': this.isFocused
        },
        tabindex: 0,
        onClick,
        onFocus,
        onKeyDown,
        onBlur,
      }),
      [
        h('div', {
          class: { 'pa__input--wrap': true },
          ref: 'containerRef',
        }, [
          h(
            'div',
            Object.assign({},this.$attrs,{
              class: [
                'pa__input-select-value'
              ],
            }),
            [this.selectedItem && typeof this.selectedItem === 'object'
              ? this.selectedItem![this.itemText] : this.selectedItem]
          ),
          this.genIcon(),
          this.genItems(),
          this.label ?
            withDirectives(h('label', this.setTextColor(this.validationState,{
              class: { 'pa__input--label': true }
            })),[
              [i18n, this.label]
            ]) : '',
          this.$slots.append ? this.$slots.append(): '',
          h('input', {
            value: this.lazyValue ,
            type: 'hidden',
            name: this.$attrs.name,
          })
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
