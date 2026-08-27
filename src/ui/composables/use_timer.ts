import { onMounted, onUnmounted, ref } from 'vue';

export const useTimer = (startFrom: number, startOnMount = true) => {
  const countdown = ref(Number(startFrom));
  let timeout: any = null;

  function start(overrideStart?: number) {
    countdown.value = Number(overrideStart ?? startFrom);
    if (timeout) {
      clearInterval(timeout);
    }
    if (countdown.value <= 0) {
      return;
    }
    timeout = setInterval(() => {
      if (countdown.value <= 1) {
        countdown.value = 0;
        clearInterval(timeout);
      } else {
        countdown.value--;
      }
    }, 1000);
  }

  onMounted(() => {
    if (startOnMount) {
      start();
    }
  });
  function stop() {
    clearInterval(timeout);
  }

  onUnmounted(() => {
    clearInterval(timeout);
  });

  return {
    countdown,
    start,
    stop,
  };
};
