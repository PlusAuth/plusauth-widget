import deepmerge from 'deepmerge';
import type { Ref } from 'vue';
import { getCurrentInstance } from 'vue';
import { ref } from 'vue';

import defaultDictionary from '../../i18n'

import type { ILocaleSettings } from '../interfaces';

import { escapeRegExp, isObject, keysToDotNotation, propertyAccessor } from '.';

export const translatorKey = Symbol('t')


export class Translator {
  private defaultLocale: string;
  private dictionary: any;
  private selectedLocale: Ref
  locales: Record<string, { label: string, codes: string[], value: string }>

  constructor(options: Partial<ILocaleSettings> = {}) {
    this.dictionary = deepmerge(defaultDictionary, options.dictionary || {});
    this.defaultLocale = options.defaultLocale = options.defaultLocale || 'en'
    this.selectedLocale = ref<string | undefined>(options.selectedLocale || this.defaultLocale)
    this.locales = Object.keys(this.dictionary).reduce((finalLocales, dictKey) => {
      finalLocales[dictKey] = options.locales?.[dictKey] || { label: dictKey, codes: [dictKey] }
      finalLocales[dictKey].value = dictKey
      return finalLocales
    }, {})
  }

  get localeRef() {
    return this.selectedLocale
  }

  set locale(locale: string) {
    if (this.locales[locale]) {
      this.selectedLocale.value = locale
    } else {
      this.selectedLocale.value = this.defaultLocale
    }
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
      || propertyAccessor(vm.dictionary[vm.defaultLocale], key);
    if (value) {
      return vm._interpolate(
        value,
        params,
        locale
      )
    } else if (opts.fallback) {
      return vm._interpolate(
        propertyAccessor(vm.dictionary[locale], opts.fallback)
        || propertyAccessor(vm.dictionary[vm.defaultLocale], opts.fallback)
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
            || propertyAccessor(this.dictionary[this.defaultLocale], v)
            || v
        )
      })
    }
    return str
  }
}
