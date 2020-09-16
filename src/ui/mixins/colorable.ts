import { ComponentOptions } from 'vue';

function isCssColor(color?: string | false): boolean {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/)
}

export const Colorable: ComponentOptions = {
  name: 'Colorable',

  props: {
    color: String,
    textColor: { type: String, required: false, default: 'white' }
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
          [color]: true,
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
          .trim().split(' ', 2) as (string | undefined)[]
        data.class = {
          ...data.class,
          [`${colorName  }--text`]: true,
        }
        if (colorModifier) {
          data.class[`text--${  colorModifier}`] = true
        }
      }
      return data
    },
  },
}
