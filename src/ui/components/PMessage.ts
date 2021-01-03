import { defineComponent, h, withDirectives, VNode, Transition } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable } from '../mixins';

function generateMessageVNode(message: string | Record<string, any>, name: string): VNode {
  if (message && typeof message === 'object') {
    return withDirectives(
      h('div', {
        class: 'pa__messages__message',
      }),
      [[i18n, {
        args: {
          ...message.args,
          field: name && `common.fields.${name}`
        },
        path: message.path
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
    const nodes = []
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
  mixins: [Colorable],
  props: {
    ...Colorable.props,
    value: { type: [String, Array], default: null },
    field: { type: String, default: null }
  },
  render() {
    return h(
      'div',
      this.setTextColor(this.color, {
        class: {
          'pa__messages': true
        }
      }),
      h(Transition, { name: 'pa__message-transition', css: true },
        { default: generateMessages.bind(this, this.value, this.field) }
      )
    )
  }
})
