<script setup lang="ts">

import AppStore from '../icons/AppStore.vue';
import PlayStore from '../icons/PlayStore.vue';

import { AuthPlusLogo } from './AuthPlusLogo.ts';

</script>

<template>
  <div
    class="pa__store-info"
  >
    <div class="pa__store-info-label">
      <h4 v-t="{ path: 'common.downloadAuthPlus', args: [AuthPlusLogo]}" />
    </div>
    <div class="pa__store-links">
      <a
        class="pa__store-link"
        href="https://apps.apple.com/tr/app/auth-2fa-authenticator/id6738983855"
        target="_blank"
      >
        <AppStore />
      </a>
      <a
        class="pa__store-link"
        href="https://play.google.com/store/apps/details?id=com.ekinoks.authplus"
        target="_blank"
      >
        <PlayStore />
      </a>
    </div>
  </div>
</template>

<style>
.auth-plus-logo{
  @apply h-4 inline ms-0.5;
}
.store-info {
  @apply p-4
  flex flex-row flex-wrap
  items-center justify-around
  border border-solid border-gray-300 mb-6
  bg-gray-50;

  &-label {
    @apply flex items-center gap-2;
  }
  .store-link {
    &s{
      @apply flex mt-2 gap-6 ;
    }
    @apply min-h-6 object-contain inline-block h-10;

    svg {
      @apply object-contain  w-auto h-full;
    }
  }
}
</style>
