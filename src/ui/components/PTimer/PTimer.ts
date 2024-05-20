import type { PropType } from 'vue';
import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue';

import './PTimer.css'
import { useTimer } from '../../composables/use_timer.ts';

export default defineComponent({
  name: 'PTimer',
  props: {
    duration: {
      type: Number as PropType<number>,
      default: 0
    }
  },
  setup(props){
    const { countdown } = useTimer(props.duration)
    return {
      countdown
    }
  },
  render(){
    return h('div',
      {
        class: ['pa__timer--circle'],
        style: { borderColor: this.countdown  > 0 ? 'orange' : 'red' }
      }, h('span', {
        class: ['pa__timer--seconds']
      }, this.countdown  )
    )
  }
})
