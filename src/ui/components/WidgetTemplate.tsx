import type { PropType } from 'vue';
import { defineComponent, h, inject } from 'vue';

export default defineComponent({
  functional: true,
  inheritAttrs: false,
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props){
    const templates = inject('templates') || {} as Record<string, HTMLElement>
    const template=  templates[props.name] as HTMLTemplateElement
    if(template){
      return () => h('span', {
        style: { display: 'contents' },
        innerHTML: template.innerHTML
      } )
    }
    return () => undefined
  },
})
