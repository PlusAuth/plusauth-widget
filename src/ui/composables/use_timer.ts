import { onMounted, onUnmounted, ref } from 'vue';

export const useTimer = (startFrom: number, startOnMount = true) => {
  const parsedStart = Number(startFrom);
  const countdown = ref(Number.isNaN(parsedStart) ? 0 : parsedStart);
  let timeout: any = null;

  function start(overrideStart?: number) {
    const parsed = Number(overrideStart ?? startFrom);
    countdown.value = Number.isNaN(parsed) ? 0 : parsed;
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
