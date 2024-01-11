<template>
  <div class="pa__logo-container">
    <img
      style="max-height: 150px"
      alt="Logo"
      src="https://static.plusauth.com/images/icons/select.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <h2
      v-t="'mfa.challenge.title'"
    />
  </div>
  <div class="pa__signin-challenges">
    <a
      v-for="challenge in context.details.challenges"
      :key="challenge"
      :href="'/signin/challenge/'+ challenge"
      class="pa__btn pa__btn--flat pa__btn--block pa__signin-challenge pa__text-primary"
      @click.stop=""
    >
      <span v-t="'mfa.challenge.'+ challenge" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import type { IPlusAuthContext } from '../../interfaces';

export default defineComponent( {
  name: 'Challenge',
  props: {},
  setup() {
    const context = inject('context') as IPlusAuthContext
    return {
      context
    }
  }
})
</script>

<style scoped>

</style>
