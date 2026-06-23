import presetRemToPx from '@unocss/preset-rem-to-px'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const colorRange = (name: string, prefix = 'pa-') => {
  const obj: Record<string, string> = {
    DEFAULT: `rgb(var(--${prefix}color-${name}))`
  }
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  stops.forEach(stop => {
    obj[stop] = `rgb(var(--${prefix}color-${name}-${stop}))`
  })
  return obj
}

export default defineConfig({

  theme: {
    fontSize: {
      base: '1.5rem'
    },
    width: {
      '20': '20%'
    },
    colors: {
      primary: colorRange('primary'),
      secondary: colorRange('secondary'),
      accent: colorRange('accent'),
      error: colorRange('error'),
      info: colorRange('info'),
      success: colorRange('success'),
      warning: colorRange('warning'),
    },
  },
  presets: [
    presetWind4({
      variablePrefix: 'pa-',
    }),
    presetIcons(),
    presetTypography(),
    presetRemToPx()
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})