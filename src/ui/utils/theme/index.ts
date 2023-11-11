/* eslint-disable no-multi-spaces */
import * as ThemeUtils from './theme_utils'

export class Theme {
  static property = 'theme'

  public disabled = false

  public options: any

  public styleEl?: HTMLStyleElement

  public theme: any = {
    primary: '#e37006',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }

  public defaults: any = this.theme

  constructor(options: any) {
    if (options.disable) {
      this.disabled = true

      return
    }

    this.options = {
      ...this.options,
      ...options.options,
    }

    const theme = options.theme || {}

    this.theme = Object.assign({},this.theme, theme )

  }

  // When setting css, check for element
  // and apply new values
  set css(val: string) {
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = val)
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
  public setTheme( value: any) {
    this.theme = Object.assign(this.theme, value)
    this.applyTheme()
  }

  // Reset theme defaults
  public resetThemes() {
    this.theme = Object.assign({}, this.defaults)
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
    return this.theme
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
