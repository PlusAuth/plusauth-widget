import { toValue } from 'vue';

import { useLocale } from '../composables';

export function getUserIdentifier(userRef: any) {
  const user = toValue(userRef)
  if (!user) {
    return ''
  }
  const name =
    user.name || [user.profile.first_name, user.profile.middle_name, user.profile.last_name].filter((v) => !!v).join(' ')
  if (name) {
    return name
  }
  if (user.email) {
    return user.email
  }
  if (user.username) {
    return user.username
  }
  if (user.phone_number) {
    return user.phone_number
  }
}

export function getInitials(input?: string, maxInitials = 2): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .split(/\s+/)                 // split by whitespace
    .filter(Boolean)              // remove empty parts
    .slice(0, maxInitials)        // limit number of initials
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
}

export function getUserInitials(userRef: any) {
  const user = toValue(userRef)
  if (!user) {
    return
  }
  const profile = user.profile || {}
  const name = user.name || [
    profile.first_name,
    profile.middle_name,
    profile.last_name
  ].filter((v) => !!v).join(' ')

  if (name) {
    return name
      .match(/(^\w\w?|\s\w)?/g)
      .map((v: string) => v.trim())
      .join('')
      .match(/(^\w|\w$)?/g)
      .join('')
      .toLocaleUpperCase()
  }
  const identifier = user.email || user.username || user.phone_number || user.id
  return identifier.charAt(0).toUpperCase() + (identifier.charAt(1)?.toUpperCase() || '')
}

function getHslVars(initials: string) {
  if (!initials) {
    return [4, 90, 58]
  }
  return [
    [4, 90, 58],
    [340, 100, 63],
    [291, 64, 42],
    [262, 52, 47],
    [231, 48, 48],
    [207, 90, 54],
    [199, 98, 48],
    [187, 100, 42],
    [174, 100, 29],
    [122, 39, 49],
    [88, 50, 53],
    [66, 70, 54],
    [54, 100, 62],
    [45, 100, 51],
    [36, 100, 50],
    [14, 100, 57],
    [16, 25, 38],
    [0, 0, 62],
    [200, 18, 46],
  ].at((initials.charCodeAt(0) - 65) % 18) as [number, number, number]
}

export function getAvatarBg(initials: string, lighten = false) {
  const [h, s, l] = getHslVars(initials)
  return `hsl(${h}, ${s}%, ${lighten ? `calc(${l}% + 30%)` : `${l}%`}`
}


export function getUserIdentifierField(context, editable = true) {
  const i18n = useLocale()
  const details = context.details || {}

  const identifier = details.user_identifier ||
    details[details.identifier] || details.identifier ||
    details.email || details.phone_number
    || details.username

  return {
    type: 'text',
    value: identifier,
    attrs: { readOnly: true },
    label: i18n.t('common.user'),
    ignored: true,
    slots: !editable ? { } : {
      prepend: {
        element: 'div',
        props: {
          innerHtml: 'User'
        }
      },
      append: {
        element: 'button',
        props: {
          type: 'button',
          class: 'pa__btn pa__btn--flat pa__pw-toggle-visibility',
          onClick: (e) => {
            e.preventDefault()
            window.location.assign('signin')
          },
          'innerHtml': i18n.t('common.edit')
        }
      }
    }
  }
}
