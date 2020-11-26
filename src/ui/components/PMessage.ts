import { defineComponent, h, withDirectives, VNode, Transition } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable } from '../mixins';

function generateMessageVNode(message: string): VNode{
  return withDirectives(
    h('div', {
      class: 'pa__messages__message',
    }),
    [[i18n, message]]
  )
}

function generateMessages(messages: any): VNode | VNode[] | undefined {
  if(!messages){
    return undefined
  }
  if(Array.isArray(messages)){
    return messages.map(message => generateMessageVNode(message))
  }else if( messages instanceof Set) {
    const nodes = []
    for (const value of messages.values()) {
      nodes.push(
        generateMessageVNode(value)
      )
    }
    return nodes
  }else{
    return generateMessageVNode(messages)
  }
}
export default defineComponent({
  name: 'PMessage',
  mixins: [Colorable],
  props: {
    ...Colorable.props,
    value: { type: [String, Array], default: null },
  },
  render(){
    return  h(
      'div',
      this.setTextColor(this.color, {
        class: {
          'pa__messages': true
        }
      }),
      h(Transition,{ name: 'message-transition', css: true },
        { default: generateMessages.bind(this, this.value) }
      )
    )
  }
})
