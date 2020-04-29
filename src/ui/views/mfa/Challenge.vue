<template>
  <p-form class="text-center">
    <img
      style="max-height: 150px"
      alt="Logo"
      src="/images/icons/select.svg"
    >
    <p class="text-center title font-weight-thin">
      Try another way to sign in
    </p>
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
export default defineComponent( {
  name: 'Challenge',
})
</script >

<style scoped >

</style >
