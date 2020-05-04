import { h,  defineComponent, withDirectives } from 'vue';

import { i18n } from '../directives/i18n';
import { Colorable } from '../mixins';

function generateMessageDiv(messages: any){
  if(!messages){
    return undefined
  }
  if(Array.isArray(messages)){

    const messageNodes = messages.map( (message, key) => {
      return withDirectives(
        h('div', {
          class: 'pa__messages__message',
        }),
        [[i18n, message]]
      )
    })
    return messageNodes
  }else if( messages instanceof Set) {
    const nodes = []
    for (const value of messages.values()) {
      nodes.push(
        withDirectives(
          h('div', {
            class: 'pa__messages__message',
          }),
          [[i18n, value]]
        )
      )
    }
    return nodes
  }else{
    return withDirectives(h('div', {
      class: 'pa__messages__message',
    }),
    [[i18n, messages]]
    )
  }

}
export default defineComponent({
  name: 'PMessage',
  mixins: [Colorable],
  props: {
    ...Colorable.props,
    value: { type: String || Array  as any },
  },
  render(){
    return h(
      'div',
      this.setTextColor(this.color, {
        class: {
          'pa__messages': true
        }
      }),
      generateMessageDiv(this.value)
    )
  }
})
