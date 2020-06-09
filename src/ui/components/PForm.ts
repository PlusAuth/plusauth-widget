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

  data: () => ({
    inputs: [] as any,
    watchers: [] as any,
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
    watchInput(input: any) {
      // @ts-ignore
      const watcher = (input: any): (() => void) => {
        // return input.$watch('hasError', (val: boolean) => {
        //   this.errorBag[input._.uid] = val
        // }, { immediate: true })
      }

      const watchers: any = {
        '_.uid': input._.uid,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        valid: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        shouldValidate: () => {},
      }

      if (this.lazyValidation) {
        // Only start watching inputs if we need to
        watchers.shouldValidate = input.$watch('shouldValidate',
          (val: boolean) => {
            if (!val) return

            // Only watch if we're not already doing it
            if (this.errorBag.hasOwnProperty(input._.uid)) return

            watchers.valid = watcher(input)
          })
      } else {
        watchers.valid = watcher(input)
      }

      return watchers
    },
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
      this.watchers.push(this.watchInput(input))
    },
    unregister(input: any) {
      const found = this.inputs.find( (i: any) => i._.uid === input._.uid)

      if (!found) return

      const unwatch = this.watchers.find((i: any) => i._.uid === found._.uid)
      if (unwatch) {
        unwatch.valid()
        unwatch.shouldValidate()
      }

      this.watchers = this.watchers.filter((i: any) => i._.uid !== found._.uid)
      this.inputs = this.inputs.filter((i: any) => i._.uid !== found._.uid)
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
