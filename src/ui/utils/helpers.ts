import type { PropType } from 'vue';

import type { Translator } from './translator.ts';

export type EventProp<T extends any[] = any[], F = (...args: T) => void> = F
export const EventProp = <T extends any[] = any[]>() => [Function, Array] as PropType<EventProp<T>>

export function toKebabCase(str = ''): string {
  if (toKebabCase.cache.has(str)) return toKebabCase.cache.get(str)!
  const kebab = str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
  toKebabCase.cache.set(str, kebab)
  return kebab
}
toKebabCase.cache = new Map<string, string>()


type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
export function wrapInArray<T>(
  v: T | null | undefined
): T extends any[]
    ? IfAny<T, T[], T>
    : NonNullable<T>[] {
  return v == null
    ? []
    : Array.isArray(v)
      ? v as any : [v]
}


export function isEmpty(obj: any){
  if(Array.isArray(obj) || typeof obj === 'string'){
    return obj.length === 0
  } else if( obj && typeof obj === 'object') {
    return Object.keys(obj).length === 0
  } else {
    return true
  }
}

/**
 * https://stackoverflow.com/a/34270811
 *
 * Translates seconds into human-readable format of seconds, minutes, hours, days, and years
 *
 */
export function secondsToReadable( seconds: number, translator: Translator ): string {
  const levels = [
    [Math.floor(seconds / 31536000), translator.t('common.years')],
    [Math.floor(seconds % 31536000 / 86400), translator.t('common.days')],
    [Math.floor(seconds % 31536000 % 86400 / 3600), translator.t('common.hours')],
    [Math.floor(seconds % 31536000 % 86400 % 3600 / 60), translator.t('common.minutes')],
    [seconds % 31536000 % 86400 % 3600 % 60, translator.t('common.seconds')],
  ] as [number ,string][];

  let returnText = '';

  for (let i = 0, max = levels.length; i < max; i++) {
    if ( levels[i][0] === 0 ) continue;
    returnText += ` ${  levels[i][0]  } ${  levels[i][0] === 1 ? levels[i][1].substring(0, levels[i][1].length-1): levels[i][1]}`;
  }
  return returnText.trim();
}
