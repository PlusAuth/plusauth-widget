import type { PropType, VNode } from 'vue';
import { defineComponent, h, withDirectives, Transition } from 'vue';

import { i18n } from '../../directives/i18n';
import type { ITranslatePath } from '../../interfaces';
import './PMessage.css'

function generateMessageVNode(message: ITranslatePath, name: string): VNode {
  if (message && typeof message === 'object') {
    return withDirectives(
      h('div', {
        class: 'pa__messages__message',
      }),
      [[i18n, {
        ...message,
        args: {
          ...message.args,
          field: name && `common.fields.${name}`
        },
      }
      ]]
    )
  }
  return withDirectives(
    h('div', {
      class: 'pa__messages__message',
    }),
    [[i18n, { args: { field: name && `common.fields.${name}` }, path: message }]]
  )
}

function generateMessages(messages: any, name: string): VNode | VNode[] | undefined {
  if (!messages) {
    return undefined
  }
  if (Array.isArray(messages)) {
    return messages.map(message => generateMessageVNode(message, name))
  } else if (messages instanceof Set) {
    const nodes = [] as any[]
    for (const value of messages.values()) {
      nodes.push(
        generateMessageVNode(value, name)
      )
    }
    return nodes
  } else {
    return generateMessageVNode(messages, name)
  }
}

export default defineComponent({
  name: 'PMessage',
  props: {
    value: {
      type: [String, Array, Object] as PropType<any>,
      default: null
    },
    field: { type: String, default: null }
  },
  render() {
    return h(
      'div', {
        class: {
          'pa__messages': true
        }
      },
      h(Transition, { name: 'pa__message-transition', css: true },
        { default: generateMessages.bind(this, this.value, this.field) }
      )
    )
  }
})
