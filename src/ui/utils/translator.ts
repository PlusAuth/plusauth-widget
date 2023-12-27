import type { Ref } from 'vue';
import { ref } from 'vue';

import { escapeRegExp, isObject, keysToDotNotation, parseArgs, propertyAccessor } from '.';

export const translatorKey = Symbol('t')


export class Translator {
  private fallBackLocale: string;
  private dictionary: any;
  private selectedLocale: Ref
  constructor(dictionary: any, fallbackLocale?: string, selectedLocale?: string) {
    this.dictionary = dictionary;
    this.fallBackLocale = fallbackLocale || 'en'
    this.selectedLocale = ref<string | undefined>(selectedLocale || this.fallBackLocale)
  }
  get localeRef() {
    return this.selectedLocale
  }
  set locale(locale: string){
    this.selectedLocale.value = locale
  }
  get locale(): string {
    return this.selectedLocale.value
  }

  t(key: string, ...values: any){
    const parsedArgs = parseArgs(values)
    const locale = parsedArgs.locale || this.locale
    return this._interpolate(
      propertyAccessor(this.dictionary[locale], key)
          || propertyAccessor(this.dictionary[this.fallBackLocale], key)
          || key?.split('.').at(-1) as string,
      parsedArgs.params,
      locale
    )
  }
  _interpolate(str: string, args: any, locale: string){
    if(!str){
      return str
    }
    if(Array.isArray(args)){
      args.forEach(arg => {
        if(isObject(arg)){
          const normalizedArg = keysToDotNotation(arg)
          Object.keys(normalizedArg).forEach(key => {
            const searchRegexp = new RegExp(`\\{\\s*${escapeRegExp(key)}\\s*\\}`, 'gm')
            const v = normalizedArg[key]
            str = str.replace(searchRegexp,
              v === null ||
              v === undefined ? '' : propertyAccessor(this.dictionary[locale], v)
                || propertyAccessor(this.dictionary[this.fallBackLocale], v)
                || v
            )
          })
        }
      })
    }
    return str
  }
}
