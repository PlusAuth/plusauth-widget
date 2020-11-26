import { Ref, ref } from 'vue';

import { escapeRegExp, isObject, keysToDotNotation, parseArgs, propertyAccessor } from '.';

export const translatorKey = Symbol('t')


export class Translator {
  private fallBackLocale: string;
  private dictionary: any;
  private selectedLocale: Ref
  constructor(dictionary: any, fallbackLocale?: string) {
    this.dictionary = dictionary;
    this.fallBackLocale = fallbackLocale || 'en'
    this.selectedLocale = ref<string | null>(this.fallBackLocale)
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
    return this._interpolate(propertyAccessor(this.dictionary[locale], key)
          || propertyAccessor(this.dictionary[this.fallBackLocale], key)
          || key,
    parsedArgs.params)
  }
  _interpolate(str: string, args: any){
    if(!str){
      return str
    }
    if(Array.isArray(args)){
      args.forEach(arg => {
        if(isObject(arg)){
          const normalizedArg = keysToDotNotation(arg)
          Object.keys(normalizedArg).forEach(key => {
            const searchRegexp = new RegExp(`\\{\\s*${escapeRegExp(key)}\\s*\\}`, 'gm')
            str = str.replace(searchRegexp,
              normalizedArg[key] === null ||
              normalizedArg[key] === undefined ? '' : normalizedArg[key]
            )
          })
        }
      })
    }
    return str
  }
}
