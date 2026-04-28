import deepmerge from 'deepmerge';
import type { Ref } from 'vue';
import { getCurrentInstance, ref } from 'vue';
import DOMPurify from 'dompurify';

import defaultDictionary from '../../i18n'
import type { ILocaleSettings } from '../interfaces';
import { escapeRegExp, isObject, keysToDotNotation, propertyAccessor } from '.';

export const translatorKey = Symbol('t')

export class Translator {
  private defaultLocale: string;
  private dictionary: any;
  private selectedLocale: Ref<string | undefined>
  locales: Record<string, { label: string, codes: string[], value: string }>

  constructor(options: Partial<ILocaleSettings> = {}) {
    this.dictionary = deepmerge(defaultDictionary, options.dictionary || {});
    this.defaultLocale = options.defaultLocale = options.defaultLocale || 'en'
    this.selectedLocale = ref<string | undefined>(options.selectedLocale || this.defaultLocale)
    this.locales = Object.keys(this.dictionary).reduce((finalLocales, dictKey) => {
      const userOpt = options.locales?.[dictKey]
      finalLocales[dictKey] = userOpt && typeof userOpt === 'object' 
        ? userOpt 
        : { label: this.dictionary[dictKey]?.$locale || dictKey, codes: [dictKey] }
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
    return this.selectedLocale.value as string
  }

  t(
    key: string,
    params?: Record<string, string | boolean | number> | (string | number | boolean)[],
    opts: {
      fallback?: string,
      locale?: string,
      sanitize?: boolean
    } = {}
  ) {
    const globalI18n = getCurrentInstance()?.appContext?.config?.globalProperties.$i18n;
    const vm = this instanceof Translator ? this : globalI18n;

    if (!vm) return key;
    
    if (!opts.fallback && (params instanceof Error || typeof params === 'string')) {
      const p = params as any;
      opts.fallback = p['error_description'] || p['error_details'] || p.message || p.name || params;
    }

    const locale = opts.locale || this.locale;
    let value = propertyAccessor(vm.dictionary[locale], key)
      || propertyAccessor(vm.dictionary[vm.defaultLocale], key);

    if (typeof value === 'string') {
      const linkRegex = /@:([\w.]+)/g;
      while (linkRegex.test(value)) {
        value = value.replace(linkRegex, (match, linkPath) => {
          return vm.t(linkPath, undefined, { locale, sanitize: false });
        });
      }
    }

    let result = key;

    if (value) {
      result = vm._interpolate(value, params, locale);
    } else if (opts.fallback) {
      let fallbackValue = propertyAccessor(vm.dictionary[locale], opts.fallback)
        || propertyAccessor(vm.dictionary[vm.defaultLocale], opts.fallback)
        || opts.fallback;
      
      result = vm._interpolate(fallbackValue, params, locale);
    }

    return DOMPurify.sanitize(result, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: []
    });
  }

  te(key: string, locale?: string): boolean {
    const vm = this instanceof Translator
      ? this
      : getCurrentInstance()?.appContext?.config?.globalProperties.$i18n;

    const loc = locale || vm.locale
    return !!(
      propertyAccessor(vm.dictionary[loc], key) ||
      propertyAccessor(vm.dictionary[vm.defaultLocale], key)
    )
  }

  _interpolate(str: string, args: any, locale: string) {
    if (!str || !args) return str;
    
    if (isObject(args)) {
      const normalizedArg = keysToDotNotation(args)
      Object.keys(normalizedArg).forEach(key => {
        const searchRegexp = new RegExp(`\\{\\s*${escapeRegExp(key)}\\s*\\}`, 'gm')
        const v = normalizedArg[key]
        const replacement = v === null || v === undefined 
          ? '' 
          : propertyAccessor(this.dictionary[locale], v) || propertyAccessor(this.dictionary[this.defaultLocale], v) || v;
        
        str = str.replace(searchRegexp, String(replacement));
      })
    }
    return str
  }
}