import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'SocialConnectionButton',
  props: {
    type: {
      type: String as () => string,
      required: true
    }
  },
  render(){
    return h('a', {
      class: {
        'pa__btn': true,
        'pa__btn--fab': true,
      }
    }, h('div', {
      class: 'pa__btn__content'
    }, h('i', {
      class: {
        'fa': true,
        'fa-2x': true,
        [`fa-${ this.type}`]: true
      }
    })))
  }
})
