import type { IWidgetSettings } from '../../interfaces';

import * as ThemeUtils from './theme_utils'

export class Theme {

  public styleEl?: HTMLStyleElement
  public theme = {
    primary: '#e37006',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }

  constructor(theme: IWidgetSettings['theme']) {
    if(theme){
      const newTheme = Object.assign({}, this.theme)
      Object.keys(newTheme).forEach((key) =>{
        if(theme[key]){
          newTheme[key] = theme[key]
        }
      })
      this.theme = newTheme
    }
    this.css = this.generatedStyles
  }

  set css(val: string) {
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = val)
  }

  private checkOrCreateStyleElement(): boolean {
    this.styleEl = document.
      getElementById('plusauth-theme-stylesheet') as HTMLStyleElement

    if (this.styleEl) return true

    this.genStyleElement()

    return Boolean(this.styleEl)
  }

  private genStyleElement(): void {
    if (typeof document === 'undefined') return

    this.styleEl = document.createElement('style')
    this.styleEl.type = 'text/css'
    this.styleEl.id = 'plusauth-theme-stylesheet'

    document.head.appendChild(this.styleEl)
  }

  get currentTheme() {
    return this.theme
  }

  get generatedStyles(): string {
    return ThemeUtils.genStyles(this.currentTheme || {})
  }

}
