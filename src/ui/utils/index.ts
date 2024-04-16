import type { IClient } from '../interfaces';

export function convertToUnit(str: string | number | null | undefined,
                              unit = 'px'): string | undefined {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str!)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
  }
}

export function propertyAccessor(object: Record<string, any>,
                                 keys: string | null,
                                 array?: any[] | any): string | null | undefined {
  if(!object){
    return undefined
  }
  array = array || keys?.toString().split('.')

  if (array.length > 1) {
    return propertyAccessor(object[array.shift()], null, array)
  } else {
    return object[array]
  }
}

const toString: (...args: any) => string = Object.prototype.toString
const OBJECT_STRING = '[object Object]'

export function isPlainObject(obj: any): boolean {
  return toString.call(obj) === OBJECT_STRING
}
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}

export function parseArgs(...args: Array<any>): {
  locale?: string | null;
  params: any;
  opts: Record<string, any>
} {
  let locale: string | null = null
  let params: any = null
  let opts = {} as any
  if (args.length === 1) {
    if (isObject(args[0]) || Array.isArray(args[0])) {
      params = args[0]
    } else if (typeof args[0] === 'string') {
      locale = args[0]
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'string') {
      locale = args[0]
    } else if(isObject(args[0]) || Array.isArray(args[0]) ){
      params = args[0]
      if(isObject(args[1])){
        opts = args[1]
      }
    }else if (isObject(args[1]) || Array.isArray(args[1])) {
      params = args[1]
    }
  }

  return { locale, params, opts }
}

export function looseEqual(a: any, b: any): boolean {
  if (a === b) {
    return true
  }
  const isObjectA: boolean = isObject(a)
  const isObjectB: boolean = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA: boolean = Array.isArray(a)
      const isArrayB: boolean = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length &&
          a.every((e: any, i: number): boolean => {
            return looseEqual(e, b[i])
          })
      } else if (!isArrayA && !isArrayB) {
        const keysA: Array<string> = Object.keys(a)
        const keysB: Array<string> = Object.keys(b)
        return keysA.length === keysB.length &&
          keysA.every((key: string): boolean => {
            return looseEqual(a[key], b[key])
          })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

export function resolveClientLogo(client: IClient) {
  return client?.logoUri || 'https://static.plusauth.com/images/logo.png'
}

export function keysToDotNotation(obj: Record<string, any>,
                                  current?: string,
                                  final?: Record<string, any>): Record<string, any>{
  if(!final) {
    final = {}
  }
  for (const key in obj) {
    const value = obj[key]
    const newKey = current ? `${current}.${key}` : key  // joined key with dot
    if (value && typeof value === 'object') {
      keysToDotNotation(value, newKey, final);  // it's a nested object, so do it again
    } else {
      final[newKey] = value;  // it's not an object, so set the property
    }
  }
  return final
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isEmail(value: string): boolean {
  return /^[\w.!#$%&’*+/=?^_`{|}~-]+@[\w-]+(?:\.[\w-]+)*$/.test(value)
}

export function isPhone(value: string): boolean {
  return /^(\+)?([ 0-9]){10,16}$/.test(value)
}

const isHexColor = (str: string) => str.startsWith('#')
const resolveColor = (color: string) => {
  return isHexColor(color) ? color :`rgb(var(--pa-color-${color}-DEFAULT))`
}
export function setColorStyle(props: { color?: string, textColor?: string } ){
  return {
    ...props.color ? {
      background: resolveColor(props.color)
    } : {},
    ...props.textColor ? { color: resolveColor(props.textColor) } : {},
  }
}
