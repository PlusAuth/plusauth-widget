<template>
  <div class="pa__logo-container">
    <img
      style="max-height: 150px"
      alt="Logo"
      src="https://api.plusauth.com/assets/images/icons/select.svg"
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
      class="pa__btn pa__btn--flat pa__btn--block pa__signin-challenge"
      @click.stop=""
    >
      <span v-t="'mfa.challenge.'+ challenge" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent( {
  name: 'Challenge',
  props: {},
  setup() {
    const context = inject('context') as any
    const challenges = context.details.challenges
    const router = useRouter()
    if(challenges?.length === 1){
      router.replace({ name: challenges[0] })
    }
    return {
      context
    }
  }
})
</script >

<style scoped >

</style >
