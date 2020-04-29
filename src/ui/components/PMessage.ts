import { h,  defineComponent } from 'vue';

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
  props: {
    value: { type: Array as any },
  },
  render(){
    return h(
      'div',
      {
        class: 'pa__messages'
      },
      generateMessageDiv(this.value)
    )
  }
})
