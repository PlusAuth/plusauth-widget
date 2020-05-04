<template>
  <p-form class="text-center">
    <img
      style="max-height: 150px"
      alt="Logo"
      src="/images/icons/select.svg"
    >
    <p
      v-t="'mfa.challenge.title'"
      class="text-center title font-weight-thin"
    />
    <div
      v-for="challenge in context.details.challenges"
      :key="challenge"
      class="row"
    >
      <a
        :href="'/signin/challenge/'+ challenge"
        class="pa__btn pa__btn--block justify-start"
        @click.stop=""
      >
        <span v-t="'mfa.challenge.'+ challenge" />
      </a>
    </div>
  </p-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Router } from 'vue-router';
export default defineComponent( {
  name: 'Challenge',
  beforeCreate() {
    const challenges = this['context'].details.challenges
    if(challenges?.length === 1){
      (this['$router'] as Router).replace({ name: challenges[0] })
    }
  }
})
</script >

<style scoped >

</style >
