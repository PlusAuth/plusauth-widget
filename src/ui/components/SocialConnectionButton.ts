import { defineComponent, h } from 'vue';

function getIconLink(type: string){
  return `https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/${type}.svg`
}
export default defineComponent({
  name: 'SocialConnectionButton',
  props: {
    type: {
      type: [String as () => string, Object as () => ({ name: string, provider: string})],
      required: true
    }
  },
  render(){
    return h(
      'a',
      {
        style: {
          backgroundImage: `url(${getIconLink(this.type.provider || this.type)})`
        },
        class: ['pa__btn', 'pa__widget-social-icon', 'pa__btn--fab'],
      },
      h(
        'div',
        {
          class: 'pa__btn__content',
        }
      )
    )
  }
})
