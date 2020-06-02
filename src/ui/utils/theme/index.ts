/* eslint-disable no-multi-spaces */
// Extensions
// Utilities
import { ref, Ref } from 'vue'

import * as ThemeUtils from './theme_utils'


export class Theme {
  static property = 'theme'

  public disabled = false

  public options: any

  public styleEl?: HTMLStyleElement

  public themes: any = {
    light: {
      primary: '#1976D2',   // blue.darken2
      secondary: '#424242', // grey.darken3
      accent: '#82B1FF',    // blue.accent1
      error: '#FF5252',     // red.accent2
      info: '#2196F3',      // blue.base
      success: '#4CAF50',   // green.base
      warning: '#FB8C00',    // amber.base
    },
    dark: {
      primary: '#2196F3',   // blue.base
      secondary: '#424242', // grey.darken3
      accent: '#FF4081',    // pink.accent-2
      error: '#FF5252',     // red.accent2
      info: '#2196F3',      // blue.base
      success: '#4CAF50',   // green.base
      warning: '#FB8C00',    // amber.base
    },
  }

  public defaults: any = this.themes

  private isDark = ref(null) as Ref

  constructor(options: any) {
    if (options.disable) {
      this.disabled = true

      return
    }

    this.options = {
      ...this.options,
      ...options.options,
    }

    this.dark = Boolean(options.dark)
    const themes = options.themes || {}

    this.themes = {
      dark: this.fillVariant(themes.dark, true),
      light: this.fillVariant(themes.light, false),
    }
  }

  // When setting css, check for element
  // and apply new values
  set css(val: string) {
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = val)
  }

  set dark(val: boolean) {
    const oldDark = this.isDark.value

    this.isDark.value = val
    // Only apply theme after dark
    // has already been set before
    oldDark != null && this.applyTheme()
  }

  get dark() {
    return Boolean(this.isDark.value)
  }

  // Apply current theme default
  // only called on client side
  public applyTheme(): void {
    if (this.disabled) return this.clearCss()

    this.css = this.generatedStyles
  }

  public clearCss(): void {
    this.css = ''
  }

  // Initialize theme for SSR and SPA
  // Attach to ssrContext head or
  // apply new theme to document
  public init(): void {
    if (this.disabled) return
    this.initTheme()
  }

  // Allows for you to set target theme
  public setTheme(theme: 'light' | 'dark', value: any) {
    this.themes[theme] = Object.assign(this.themes[theme], value)
    this.applyTheme()
  }

  // Reset theme defaults
  public resetThemes() {
    this.themes.light = Object.assign({}, this.defaults.light)
    this.themes.dark = Object.assign({}, this.defaults.dark)
    this.applyTheme()
  }

  // Check for existence of style element
  private checkOrCreateStyleElement(): boolean {
    this.styleEl = document.
      getElementById('plusauth-theme-stylesheet') as HTMLStyleElement

    /* istanbul ignore next */
    if (this.styleEl) return true

    this.genStyleElement() // If doesn't have it, create it

    return Boolean(this.styleEl)
  }

  private fillVariant(
    theme: any,
    dark: boolean
  ): any {
    const defaultTheme = this.themes[dark ? 'dark' : 'light']

    return Object.assign({},
      defaultTheme,
      theme
    )
  }

  // Generate the style element
  // if applicable
  private genStyleElement(): void {
    if (typeof document === 'undefined') return

    /* istanbul ignore next */
    const options = this.options || {}

    this.styleEl = document.createElement('style')
    this.styleEl.type = 'text/css'
    this.styleEl.id = 'plusauth-theme-stylesheet'

    if (options.cspNonce) {
      this.styleEl.setAttribute('nonce', options.cspNonce)
    }

    document.head.appendChild(this.styleEl)
  }

  private initTheme() {
    // Only watch for reactivity on client side
    if (typeof document === 'undefined') return

  }

  get currentTheme() {
    const target = this.dark ? 'dark' : 'light'

    return this.themes[target]
  }

  get generatedStyles(): string {
    const theme = this.parsedTheme
    /* istanbul ignore next */
    const options = this.options || {}
    let css

    if (options.themeCache != null) {
      css = options.themeCache.get(theme)
      /* istanbul ignore if */
      if (css != null) return css
    }

    css = ThemeUtils.genStyles(theme, options.customProperties)

    if (options.minifyTheme != null) {
      css = options.minifyTheme(css)
    }

    if (options.themeCache != null) {
      options.themeCache.set(theme, css)
    }

    return css
  }

  get parsedTheme(): any {
    /* istanbul ignore next */
    const theme = this.currentTheme || {}
    return ThemeUtils.parse(theme)
  }
}
