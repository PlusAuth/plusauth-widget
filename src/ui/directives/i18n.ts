import {  DirectiveBinding, VNode, ObjectDirective } from 'vue';

import { isPlainObject } from '../utils';

function makeParams(locale: string, args: any): Array<any> {
  const params: Array<any> = []

  locale && params.push(locale)
  if (args && (Array.isArray(args) || isPlainObject(args))) {
    params.push(args)
  }

  return params
}

function parseValue(value: any): any {
  let path: string
  let locale: string | undefined = undefined
  let args: any = undefined

  if (typeof value === 'string' || !value) {
    path = value
  } else if (isPlainObject(value)) {
    path = value.path
    locale = value.locale
    args = value.args
  }else{
    throw new Error('unsupported value')
  }

  return {
    path,
    locale,
    args
  }
}

function translate(el: any, binding: DirectiveBinding,
                   vnode: VNode<any, any>): void {
  const value: any = binding.value

  const { path, locale, args } = parseValue(value)
  if (!path && !locale && !args) {
    console.warn('value type not supported')
    return
  }

  if (!path) {
    console.warn('`path` is required in v-t directive')
    return
  }

  const $i18n = binding?.instance?.$.appContext.config.globalProperties.$i18n
  el._vt = el.innerHTML = $i18n?.t(path, ...makeParams(locale, args))
  el._locale = $i18n?.locale
}

export const i18n: ObjectDirective = {
  beforeMount: (el, binding, vnode) => {
    translate(el, binding, vnode)
  },
  beforeUpdate: (el, binding, vnode, prevVNode) => {

    translate(el, binding, vnode)
  },
  unmounted: (el, binding, vnode, prevVNode) => {

    el._vt = undefined
    delete el['_vt']
    el._locale = undefined
    delete el['_locale']
  }
}
