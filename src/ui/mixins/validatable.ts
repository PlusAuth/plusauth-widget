import { ComponentOptions } from 'vue';

export const Validatable: ComponentOptions = {
  inject: ['form'],
  props: {
    disabled: Boolean,
    error: Boolean,
    errorCount: {
      type: [Number, String],
      default: 1,
    },
    errorMessages: {
      type: [String, Array],
      default: () => [],
    },
    messages: {
      type: [String, Array] ,
      default: () => [],
    },
    readonly: Boolean,
    validateOnInit: Boolean,
    rules: {
      type: Array ,
      default: () => [],
    },
  },
  data() {
    return {
      errorBucket: [] as string[],
      hasColor: false,
      hasFocused: false,
      hasInput: false,
      isFocused: false,
      isResetting: false,
      lazyValue: null,
      valid: false,
    }
  },

  computed: {
    computedColor(): string | undefined {
      if (this.disabled) return undefined
      if (this.color) return this.color
      else return 'primary'
    },
    hasError(): boolean {
      return (
        this.internalErrorMessages.length > 0 ||
        this.errorBucket.length > 0 ||
        this.error
      )
    },
    externalError(): boolean {
      return this.internalErrorMessages.length > 0 || this.error
    },
    hasMessages(): boolean {
      return this.validationTarget.length > 0
    },
    hasState(): boolean {
      if (this.disabled) return false

      return (
        this.shouldValidate && this.hasError
      )
    },
    internalErrorMessages() {
      return this.genInternalMessages(this.errorMessages)
    },
    internalMessages() {
      return this.genInternalMessages(this.messages)
    },
    internalValue: {
      get(): any {
        // @ts-ignore
        return this.lazyValue
      },
      set(val: any) {
        // @ts-ignore
        this.lazyValue = val

        // @ts-ignore
        this.$emit('input', val)
      },
    },
    shouldValidate(): boolean {
      if (this.externalError) return true
      if (this.isResetting) return false

      return this.hasInput || this.hasFocused
    },
    validations() {
      return this.validationTarget.slice(0, Number(this.errorCount))
    },
    validationState(): string | undefined {
      if (this.disabled) return undefined
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasColor) return this.computedColor
      return undefined
    },
    validationTarget() {
      if (this.internalErrorMessages.length > 0) {
        return this.internalErrorMessages
      } else if (this.messages.length > 0) {
        return this.internalMessages
      } else if (this.shouldValidate || this.validateOnInit) {
        return this.errorBucket
      } else return []
    },
  },

  watch: {
    rules: {
      handler() {
        this.validate()
      },
      deep: true,
    },
    internalValue() {
      // If it's the first time we're setting input,
      // mark it with hasInput
      this.hasInput = true
      this.$nextTick(this.validate)
    },
    isFocused(val) {
      // Should not check validation
      // if disabled
      if (
        !val &&
        !this.disabled
      ) {
        this.hasFocused = true
        this.$nextTick(this.validate)
      }
    },
    isResetting() {
      setTimeout(() => {
        this.hasInput = false
        this.hasFocused = false
        this.isResetting = false
        this.validate()
      }, 0)
    },
    hasError(val) {
      if (this.shouldValidate) {
        this.$emit('update:error', val)
      }
    },
    value(val) {
      this.lazyValue = val
    },
  },

  beforeMount() {
    this.lazyValue = this.modelValue
    this.validate()
  },

  created() {
    this.form?.register(this)
  },

  beforeUnmount() {
    this.form?.unregister(this)
  },

  methods: {
    genInternalMessages(messages: any) {
      if (!messages) return []
      else if (Array.isArray(messages)) return messages
      else return [messages]
    },
    reset() {
      this.isResetting = true
      this.internalValue = Array.isArray(this.internalValue)
        ? []
        : undefined
    },
    resetValidation() {
      this.isResetting = true
    },
    async validate(force = false, value?: any): Promise<boolean> {
      const errorBucket = []
      value = value || this.internalValue

      if (force) this.hasInput = this.hasFocused = true

      for (let index = 0; index < this.rules.length; index++) {
        const rule = this.rules[index]
        let valid = typeof rule === 'function' ? rule(value) : rule
        if(Boolean(valid && typeof valid.then === 'function') ) {
          valid = await valid
        }
        if (typeof valid === 'string' || valid !== true) {
          errorBucket.push(valid || '')
        }
      }

      this.errorBucket = errorBucket
      this.valid = errorBucket.length === 0

      return this.valid
    },
  },
}
