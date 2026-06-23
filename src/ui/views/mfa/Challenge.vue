<script setup lang="ts">
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext } from '../../composables';

defineOptions({
  name: 'Challenge'
});

const context = useContext();
</script>

<template>
  <WidgetLayout
    logo="images/icons/select.svg"
    title="mfa.challenge.title"
  >
    <div class="pa__signin-challenges">
      <a
        v-for="challenge in context.details.challenges"
        :key="challenge"
        :href="'signin/challenge/' + challenge"
        class="pa__btn pa__btn--flat pa__btn--block pa__signin-challenge pa__text-primary"
        @click.stop=""
      >
        <span v-t="'mfa.challenge.' + challenge" />
      </a>
    </div>
  </WidgetLayout>
</template>

<style scoped>
</style>