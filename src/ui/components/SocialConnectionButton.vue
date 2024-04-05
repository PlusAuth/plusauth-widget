<template>
  <p-btn
    class="pa__widget-social-button"
    :block="mode === 'block'"
    :class="{ 'pa__widget-social-button-circle': mode === 'circle' }"
    :href="'/social?provider=' + (typeof connection === 'string' ? connection : connection.name )"
  >
    <span
      class="pa__widget-social-icon"
      :style="{
        backgroundImage: `url(${iconLink})`
      }"
    />
    <div
      v-if="mode === 'block'"
      class="pa__btn__content"
    >
      <span
        v-t="{
          path: langKey,
          args: [
            typeof connection === 'string'
              ? connection
              : connection.branding?.display_name || connection.provider
          ]
        }"
      />
    </div>
  </p-btn>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import type { IWidgetSettings } from '../interfaces';

import PBtn from './PBtn/PBtn.vue';

const props = defineProps<{
  langKey: string,
  connection: string | {
    name: string,
    provider: string,
    branding: {
      show_in_login?: boolean
      logo_url?: string
      display_name?: string
      [k: string]: any
    }
  }
}>()
const settings = inject('settings') as Partial<IWidgetSettings>

const mode = settings.socialLogin?.buttonVariant || 'block'
function iconUrl(provider: string){
  return `https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/${provider}.svg`
}

const iconLink = typeof props.connection === 'string'
  ? iconUrl(props.connection)
  : props.connection.branding?.logo_url || iconUrl(props.connection.provider)
</script>

<style scoped>

</style>
