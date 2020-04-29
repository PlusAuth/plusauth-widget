import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'PTimer',
  props: {
    duration: {
      type: Number as () => number,
      default: 0
    }
  },
  setup(props){
    const durationRef = ref(props.duration as number)
    let timeout: any = null
    onMounted(() => {
      timeout = setInterval(()=>{
        durationRef.value--
        if(durationRef.value < 1){
          clearInterval(timeout)
        }
      }, 1000)
    })
    onUnmounted(() => {
      clearInterval(timeout)
    })
    return {
      durationRef
    }
  },
  render(){
    return h('div',
      {
        class: ['pa__timer--circle'],
        style: { borderColor: this.durationRef > 0 ? 'orange' : 'red' }
      }, h('span', {
        class: ['pa__timer--seconds']
      }, this.durationRef )
    )
  }
})
