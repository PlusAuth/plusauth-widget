const genColorVariableName = (name: string, variant = 'color'):
string => `--pa-${variant}-${name}`

export function genStyles(theme: any): string {
  const colors = Object.keys(theme)

  if (!colors.length) return ''

  let variablesCss = ''

  for (let i = 0; i < colors.length; ++i) {
    const name = colors[i]
    const value = theme[name]
    if(value && typeof value==='string'){
      const swatch = createSwatches(value)
      swatch.forEach(({ stop, plainRgb }) => {
        variablesCss += `  ${genColorVariableName(`${name}-${stop}`)}: ${plainRgb};\n`
      })
      const defColor = swatch.find(s => s.stop === 500)
      variablesCss += `  ${genColorVariableName(`${name}-DEFAULT`)}: ${defColor!.plainRgb};\n`
    }
  }

  variablesCss = `:root {\n${variablesCss}}\n\n`

  return variablesCss
}

export function hexToRGB(H: string) {
  if (H.length === 6 && !H.startsWith('#')) {
    H = `#${H}`
  }

  let r = '0'
  let g = '0'
  let b = '0'
  if (H.length === 4) {
    r = `0x${H[1]}${H[1]}`
    g = `0x${H[2]}${H[2]}`
    b = `0x${H[3]}${H[3]}`
  } else if (H.length === 7) {
    r = `0x${H[1]}${H[2]}`
    g = `0x${H[3]}${H[4]}`
    b = `0x${H[5]}${H[6]}`
  }

  return {
    r: Number(r),
    g: Number(g),
    b: Number(b)
  }
}

export function hexToHSL(H: string) {
  if (H.length === 6 && !H.startsWith('#')) {
    H = `#${H}`
  }

  // Convert hex to RGB first
  let { r, g, b } = hexToRGB(H)
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = (g - b) / delta % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  //   return `hsl(${h},${s}%,${l}%)`;
  return { h, s, l }
}

export function HSLtoRGB(h: number, s: number, l: number) {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(h / 60 % 2 - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export function unsignedModulo(x: number, n: number) {
  return (x % n + n) % n
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max)
}

const DEFAULT_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000]

const DEFAULT_STOP = 500

export function createSwatches(hexColor: string) {

  // Get the base hex's H/S/L values
  const { h: valueH, s: valueS, l: valueL } = hexToHSL(hexColor)

  const distributionScale =createDistributionValues(0, 100, valueL)

  return DEFAULT_STOPS.map((stop, stopIndex) => {
    const newH = unsignedModulo(valueH, 360)
    const newS = clamp(valueS, 0, 100)
    const newL = distributionScale[stopIndex]

    const newHex = HSLtoRGB(newH, newS, newL)

    return {
      stop,
      plainRgb: `${newHex.r} ${newHex.g} ${newHex.b}`,
    }
  })
}

export function createDistributionValues(
  min: number = 0,
  max: number = 100,
  lightness: number,
  stop: number = DEFAULT_STOP
) {
  const stops = DEFAULT_STOPS

  // Create known stops
  const newValues = [] as number[]

  // Create missing stops
  for (let i = 0; i < stops.length; i++) {
    const stopValue = stops[i]

    const diff = Math.abs((stopValue - stop) / 100)
    const totalDiff =
      stopValue < stop
        ? Math.abs(stops.indexOf(stop) - stops.indexOf(DEFAULT_STOPS[0])) - 1
        : Math.abs(stops.indexOf(stop) - stops.indexOf(DEFAULT_STOPS[DEFAULT_STOPS.length - 1])) - 1
    const increment = stopValue < stop ? max - lightness : lightness - min

    const tweak =
      stopValue < stop
        ? increment / totalDiff * diff + lightness
        : lightness - increment / totalDiff * diff

    newValues.push(Math.round(tweak))
  }

  newValues.sort((a, b) => b - a)

  return newValues
}
