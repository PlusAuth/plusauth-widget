import type { Ref } from 'vue';
import { getCurrentInstance } from 'vue';
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

  set locale(locale: string) {
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
  ) {
    const vm = this instanceof Translator
      ? this
      : getCurrentInstance()?.appContext?.config?.globalProperties.$i18n;

    if (!opts.fallback && (params instanceof Error || typeof params === 'string')) {
      opts.fallback = params['error_description']
        || params['error_details']
        || params.message
        || params.name
        || params
    }
    const locale = opts.locale || this.locale
    const value = propertyAccessor(vm.dictionary[locale], key)
      || propertyAccessor(vm.dictionary[vm.fallBackLocale], key);
    if (value) {
      return vm._interpolate(
        value,
        params,
        locale
      )
    } else if (opts.fallback) {
      return vm._interpolate(
        propertyAccessor(vm.dictionary[locale], opts.fallback)
        || propertyAccessor(vm.dictionary[vm.fallBackLocale], opts.fallback)
        || opts.fallback,
        params,
        locale
      )
    } else {
      return key
    }
  }

  _interpolate(str: string, args: any, locale: string) {
    if (!str || !args) {
      return str
    }
    if (isObject(args)) {
      const normalizedArg = keysToDotNotation(args)
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
    return str
  }
}
