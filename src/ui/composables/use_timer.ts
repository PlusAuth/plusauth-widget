import { onMounted, onUnmounted, ref } from 'vue';

export const useTimer = ( startFrom: number, startOnMount = true ) => {
  const countdown = ref(startFrom as number)
  let timeout: any = null

  function start(overrideStart?: number){
    countdown.value = overrideStart || startFrom
    if(timeout){
      clearInterval(timeout)
    }
    timeout = setInterval(()=>{
      countdown.value--
      if(countdown.value < 1){
        clearInterval(timeout)
      }
    }, 1000)
  }

  onMounted(() => {
    if(startOnMount){
      start()
    }
  })
  function stop(){
    clearInterval(timeout)
  }

  onUnmounted(() => {
    clearInterval(timeout)
  })

  return {
    countdown,
    start,
    stop
  }
}
