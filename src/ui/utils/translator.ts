import { parseArgs, propertyAccessor } from '.';

export const translatorKey = Symbol('t')


export class Translator {
  private fallBackLocale: string;
  private dictionary: any;
  private selectedLocale: string
  constructor(dictionary: any, fallbackLocale?: string) {
    this.dictionary = dictionary;
    this.fallBackLocale = fallbackLocale || 'en'
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
    return propertyAccessor(this.dictionary[locale], key)
          || propertyAccessor(this.dictionary[this.fallBackLocale], key)
          || key
  }
}
