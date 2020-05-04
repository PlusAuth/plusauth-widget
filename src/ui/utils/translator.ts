import { isObject, parseArgs, propertyAccessor } from '.';

export const translatorKey = Symbol('t')


export class Translator {
  private fallBackLocale: string;
  private dictionary: any;
  private selectedLocale: string
  constructor(dictionary: any, fallbackLocale?: string) {
    this.dictionary = dictionary;
    this.fallBackLocale = fallbackLocale || 'i18n'
  }
  set locale(locale: string){
    this.selectedLocale = locale
  }
  get locale(): string {
    return this.selectedLocale
  }

  t(key: string, ...values: any){
    const parsedArgs = parseArgs(values)
    const locale = parsedArgs.locale || this.fallBackLocale
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
          Object.keys(arg).forEach(key => {
            str = str.replace(`{${key}}`,
              arg[key] === null || arg[key] === undefined ? '' : arg[key])
          })
        }
      })
    }
    return str
  }
}
