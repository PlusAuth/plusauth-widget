import type { PropType } from 'vue';
import { defineComponent, h } from 'vue';

import { Colorable } from '../mixins';

export default defineComponent({
  name: 'PIcon',
  mixins: [Colorable],
  props: {
    ...Colorable.props,
    color: { type: String as PropType<string>, default: '#000' },
  },
  render(){
    const textContent = this.$slots.default ? this.$slots.default()[0].children : '';
    return h('i', this.setTextColor(this.color, {
      class: {
        'pa__icon': true,
        [(textContent || '').toString()]: true
      }
    }))
  }
})
