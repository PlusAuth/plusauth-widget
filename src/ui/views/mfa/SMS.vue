<template>
  <p-form class="text-center">
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="logo"
      alt="Logo"
      src="/images/icons/message-on-phone.svg"
    >
    <PTimer
      v-if="timerEnabled"
      :duration="120"
    />
    <div class="subtitle-2 text-left">
      Enter verification code sent to:
      <strong>{{ context.details.email }}</strong>
    </div>
  </p-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PTimer from '../../components/PTimer';

export default defineComponent({
  name: 'SMS',
  components: { PTimer },
  props: {
    timerEnabled: {
      type: Boolean as () => boolean,
      default: true
    }
  }
})
</script >

<style scoped >

</style >
