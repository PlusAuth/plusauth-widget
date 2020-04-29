import { h,  defineComponent } from 'vue';

import { Colorable } from '../mixins';

function generateMessageDiv(messages: any){
  if(!messages){
    return undefined
  }
  if(Array.isArray(messages)){

    const messageNodes = messages.map( (message, key) => {
      return h('div', {
        class: 'pa__messages__message',
      }, message)
    })
    return messageNodes
  }else if( messages instanceof Set) {
    const nodes = []
    for (const value of messages.values()) {
      nodes.push(h('div', {
        class: 'pa__messages__message',
      }, value))
    }
    return nodes
  }else{
    return h('div', {
      class: 'pa__messages__message',
    }, messages)
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
