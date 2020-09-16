
export function parse(
  theme: any,
  isItem = false
): any {
  const { anchor, ...variant } = theme
  const colors = Object.keys(variant)
  const parsedTheme: any = {}

  for (let i = 0; i < colors.length; ++i) {
    const name = colors[i]
    const value = theme[name]

    if (value == null) continue

    if (isItem) {
      /* istanbul ignore else */
      if (name === 'base'
        || name.startsWith('lighten')
        || name.startsWith('darken')) {
      }
    } else if (typeof value === 'object') {
      parsedTheme[name] = parse(value, true)
    } else {
      parsedTheme[name] = value
    }
  }
  if (parsedTheme) {

    if (!isItem) {
      parsedTheme.anchor = anchor || parsedTheme.base
    }
  }

  return parsedTheme
}

/**
 * Generate the CSS for a base color (.primary)
 */
const genBaseColor = (name: string, value: string): string => {
  return `
.pa__widget .pa__${name} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.pa__widget .pa__${name}--text {
  color: ${value} !important;
  caret-color: ${value} !important;
}`
}

/**
 * Generate the CSS for a variant color (.primary.darken-2)
 */
const genVariantColor = (name: string, variant: string, value: string):
string => {
  const [type, n] = variant.split(/(\d)/, 2)
  return `
.pa__widget .pa__${name}.${type}-${n} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.pa__widget .pa__${name}--text.text--${type}-${n} {
  color: ${value} !important;
  caret-color: ${value} !important;
}`
}

const genColorVariableName = (name: string, variant = 'base'):
string => `--pa-${name}-${variant}`

const genColorVariable = (name: string, variant = 'base'):
string => `var(${genColorVariableName(name, variant)})`

export function genStyles(theme: any, cssVar = false): string {
  const { anchor, ...variant } = theme
  const colors = Object.keys(variant)

  if (!colors.length) return ''

  let variablesCss = ''
  let css = ''

  const aColor = cssVar ? genColorVariable('anchor') : anchor
  css += `.pa__widget a { color: ${aColor}; }`
  // eslint-disable-next-line max-len
  cssVar && (variablesCss += `  ${genColorVariableName('anchor')}: ${anchor};\n`)

  for (let i = 0; i < colors.length; ++i) {
    const name = colors[i]
    const value = theme[name]

    css += genBaseColor(name, cssVar ? genColorVariable(name)
      : value.base || value)
    // eslint-disable-next-line max-len
    cssVar && (variablesCss += `  ${genColorVariableName(name)}: ${value.base};\n`)

    const variants = Object.keys(value)
    for (let i = 0; i < variants.length; ++i) {
      const variant = variants[i]
      const variantValue = value[variant]
      if (variant === 'base') continue

      css += genVariantColor(name, variant,
        cssVar ? genColorVariable(name, variant) : variantValue)
      // eslint-disable-next-line max-len
      cssVar && (variablesCss += `  ${genColorVariableName(name, variant)}: ${variantValue};\n`)
    }
  }

  if (cssVar) {
    variablesCss = `:root {\n${variablesCss}}\n\n`
  }

  return variablesCss + css
}

