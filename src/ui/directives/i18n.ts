import type {  DirectiveBinding, ObjectDirective } from 'vue';

import { isPlainObject } from '../utils';


function parseValue(value: any): any {
  let path: string
  let locale: string | undefined = undefined
  let fallback: string | undefined = undefined
  let args: any = undefined

  if (typeof value === 'string' || !value) {
    path = value
  } else if (isPlainObject(value)) {
    path = value.path
    locale = value.locale
    fallback = value.fallback
    args = value.args || value.params
  }else if (Array.isArray(value)){
    path = value[0]
    args = value[1]
  } else {
    throw new Error('unsupported value')
  }

  return {
    path,
    locale,
    fallback,
    args
  }
}

function translate(el: any, binding: DirectiveBinding): void {
  const value: any = binding.value

  const { path, locale, args, fallback } = parseValue(value)
  if (!path && !locale && !args) {
    console.warn('value type not supported')
    return
  }

  if (!path) {
    console.warn('`path` is required in v-t directive')
    return
  }

  const $i18n = binding?.instance?.$.appContext.config.globalProperties.$i18n
  el._vt = el.innerHTML = $i18n?.t(path, args, { locale, fallback })
  el._locale = $i18n?.locale
}

export const i18n: ObjectDirective = {
  beforeMount: (el, binding) => {
    translate(el, binding)
  },
  beforeUpdate: (el, binding) => {
    translate(el, binding)
  },
  unmounted: (el) => {
    el._vt = undefined
    delete el['_vt']
    el._locale = undefined
    delete el['_locale']
  }
}
