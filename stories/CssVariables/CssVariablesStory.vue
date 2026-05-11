<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import PlusAuthWidget from '../../src';
import type { IPlusAuthContext, IWidgetSettings } from '../../src/ui/interfaces';
import { useConfig } from '../useConfig';

const props = defineProps<{
  cssVariables: Record<string, string | number>
}>();

const wrapperRef = ref<HTMLElement>();
const widget = ref<PlusAuthWidget>();

const settings: Partial<IWidgetSettings> = {
  theme: {},
  modeOptions: {
    login: {
      fields: {
        password: {
          order: 1,
          errors: ['Password is required']
        },
        otpCode: {
          order: 2,
          type: 'code',
          label: 'OTP'
        },
        accept: {
          order: 3,
          type: 'checkbox',
          label: 'I accept terms and conditions'
        }
      }
    }
  }
};

const context: Partial<IPlusAuthContext> = {
  client: {
    clientName: 'PlusAuth',
    tosUri: 'https://sometosuri.com',
    policyUri: 'https://somepolicyuri.com',
    logoUri: 'https://static.plusauth.com/images/logo.png',
    social: [
      { name: 'google-connection', provider: 'google' },
      { name: 'facebook-connection', provider: 'facebook' },
    ]
  },
  settings: {
    register_enabled: true,
    forgot_password_enabled: true,
    password_policy: {
      min: 4,
      max: 16,
      lower_case: 4
    }
  },
};

const unmountWidget = () => {
  // @ts-expect-error _view is the mounted Vue app; stories need it for clean remounts.
  widget.value?._view.unmount();
  widget.value = undefined;
};

const mountWidget = async () => {
  await nextTick();

  if (!wrapperRef.value) return;

  unmountWidget();
  wrapperRef.value.innerHTML = '';

  const config = useConfig(settings, context);
  widget.value = new PlusAuthWidget(wrapperRef.value, config.settings, config.context as any);
};

onMounted(mountWidget);
onBeforeUnmount(unmountWidget);

watch(() => props.cssVariables, mountWidget, { deep: true, flush: 'post' });
</script>

<template>
  <div
    class="css-variables-story"
    :style="cssVariables"
  >
    <div
      ref="wrapperRef"
      class="css-variables-story__wrapper"
    />
  </div>
</template>

<style scoped>
.css-variables-story,
.css-variables-story__wrapper {
  height: 100%;
}
</style>
