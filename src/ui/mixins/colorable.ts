import { ComponentOptions, PropType } from 'vue';

function isCssColor(color?: string | false): boolean {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/)
}

export const Colorable: ComponentOptions = {
  name: 'Colorable',

  props: {
    color: String as PropType<string>,
    textColor: { type: String as PropType<string>, required: false, default: '#fff' }
  },

  methods: {
    setBackgroundColor(color?: string | false, data: any = {}): any {
      if (typeof data.style === 'string') {
        // istanbul ignore next
        console.error('style must be an object', this)
        // istanbul ignore next
        return data
      }
      if (typeof data.class === 'string') {
        // istanbul ignore next
        console.error('class must be an object', this)
        // istanbul ignore next
        return data
      }
      if (isCssColor(color)) {
        data.style = {
          ...data.style as Record<string, unknown>,
          'background-color': `${color}`,
          'border-color': `${color}`,
        }
      } else if (color) {
        data.class = {
          ...data.class,
          [`pa__${color}`]: true,
        }
      }

      return data
    },

    setTextColor(color?: string | false, data: any = {}): any {
      if (typeof data.style === 'string') {
        // istanbul ignore next
        console.error('style must be an object', this)
        // istanbul ignore next
        return data
      }
      if (typeof data.class === 'string') {
        // istanbul ignore next
        console.error('class must be an object', this)
        // istanbul ignore next
        return data
      }
      if (isCssColor(color)) {
        data.style = {
          ...data.style as Record<string, unknown>,
          color: `${color}`,
          'caret-color': `${color}`,
        }
      } else if (color) {
        const [colorName, colorModifier] = color.toString()
          .trim().split(' ', 2) as string[]
        data.class = {
          ...data.class,
          [`pa__${colorName  }--text`]: true,
        }
        if (colorModifier) {
          data.class[`pa__text--${  colorModifier}`] = true
        }
      }
      return data
    },
  },
}
