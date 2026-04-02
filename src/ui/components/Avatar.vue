<script setup lang="ts">
import { getAvatarBg } from '../utils/user.ts';

defineProps<{
  initials: string,
  picture?: string,
}>()

</script>

<template>
  <div
    class="pa__avatar"
    :style="!picture && {
      color: getAvatarBg(initials, true),
      backgroundColor: getAvatarBg(initials),
    }"
  >
    <img
      v-if="picture"
      :src="picture"
      alt="User picture"
    >
    <span v-else>
      {{ initials }}
    </span>
  </div>
</template>

<style>

.avatar {
  @apply rounded-full overflow-hidden
    flex items-center justify-center
    ring-1 ring-gray-200/80 w-full;

  max-width: theme('width.20');
  min-width: 32px;
  aspect-ratio: 1;
  container-type: size;

  img {
    object-fit: contain;
    height: 100%;
    scale: 1.1;
  }

  span {
    font-size: 1.7rem;
    font-size: 50cqw;
  }
}
</style>
