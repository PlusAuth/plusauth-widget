<template>
  <p-form class="pa__text-center">
    <img
      style="max-height: 150px"
      alt="Logo"
      src="/images/icons/select.svg"
    >
    <p
      v-t="'mfa.challenge.title'"
      class="pa__text-center pa__title pa__font-weight-thin"
    />
    <div
      v-for="challenge in context.details.challenges"
      :key="challenge"
      class="pa__row"
    >
      <a
        :href="'/signin/challenge/'+ challenge"
        class="pa__btn pa__btn--flat pa__btn--block pa__justify-start pa__px-4 pa__py-2"
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
