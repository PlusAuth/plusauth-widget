import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'PForm',
  provide(){
    return {
      form: {
        register: this.register,
        unregister: this.unregister
      }
    }
  },
  inheritAttrs: false,
  props: {
    lazyValidation: Boolean,
    value: Boolean,
  },
  emits: ['input', 'submit'],

  data: () => ({
    inputs: [] as any,
    errorBag: {} as any,
  }),

  watch: {
    errorBag: {
      handler(val) {
        if(val){
          const errors = Object.values(val).includes(true)
          this.$emit('input', !errors)
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    /** @dev */
    async validate(): Promise<boolean> {
      let invalid = 0;
      for (let i = 0; i < this.inputs.length; i++) {
        const input = this.inputs[i]
        if(!await input.validate(true)){
          invalid++
        }
      }
      return invalid === 0
    },
    /** @dev */
    reset(): void {
      this.inputs.forEach(function (input: any) {
        return input.reset();
      })
      this.resetErrorBag()
    },
    resetErrorBag() {
      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          this.errorBag = {}
        }, 0)
      }
    },
    /** @dev */
    resetValidation() {
      this.inputs.forEach(function (input: any) {
        return input.resetValidation();
      })
      this.resetErrorBag()
    },
    register(input: any) {
      this.inputs.push(input)
    },
    unregister(input: any) {
      const found = this.inputs.find( (i: any) => i._?.uid === input._.uid)

      if (!found) return

      this.inputs = this.inputs.filter((i: any) => i._?.uid !== found._.uid)
      delete this.errorBag[found._.uid]
    },
  },

  render() {
    return h('form', {
      ...this.$attrs,
      class: ['pa__form', this.$attrs.class],
      novalidate: true,
      onSubmit: (e: Event) => this.$emit('submit', e),
    }, this.$slots.default ? this.$slots.default() : [] )
  },
})
