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
        class="pa__btn pa__btn--block justify-start px-4 py-2"
        @click.stop=""
      >
        <span v-t="'mfa.challenge.'+ challenge" />
      </a>
    </div>
  </p-form>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent( {
  name: 'Challenge',
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
