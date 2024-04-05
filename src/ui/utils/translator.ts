import type { Ref } from 'vue';
import { ref } from 'vue';

import { escapeRegExp, isObject, keysToDotNotation, propertyAccessor } from '.';

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

  t(
    key: string,
    params?: Record<string, string | boolean | number> | (string | number | boolean)[],
    opts: {
      fallback?: string,
      locale?: string
    } = {}
  ){
    const locale = opts.locale || this.locale
    const value =  propertyAccessor(this.dictionary[locale], key)
      || propertyAccessor(this.dictionary[this.fallBackLocale], key);
    if(value) {
      return this._interpolate(
        value,
        params,
        locale
      )
    } else if(opts.fallback){
      return this._interpolate(
        propertyAccessor(this.dictionary[locale], opts.fallback)
        || propertyAccessor(this.dictionary[this.fallBackLocale], opts.fallback)
        || opts.fallback,
        params,
        locale
      )
    } else {
      return key
    }
  }
  _interpolate(str: string, args: any, locale: string){
    if(!str || !args){
      return str
    }
    const replace = (arg: any) => {
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
    }
    if(Array.isArray(args)){
      args.forEach(replace)
    } else {
      replace(args)
    }
    return str
  }
}
