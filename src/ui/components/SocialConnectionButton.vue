<template>
  <p-btn
    class="pa__widget-social-button"
    ref="btnRef"
    :block="mode === 'block'"
    :class="{
      'pa__widget-social-button-circle': mode === 'circle'
    }"
    :href="'social?provider=' + (typeof connection === 'string' ? connection : connection.name )"
    :aria-label="providerLabel"
    :title="providerLabel"
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
              : providerLabel
          ]
        }"
      />
    </div>
  </p-btn>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { resolveCssVariableVariant } from '../utils';

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

const btnRef = ref<any>();
const iconVariants = ['block', 'circle'] as const;
const mode = ref<typeof iconVariants[number]>(resolveCssVariableVariant('--pa-icon-variant', iconVariants));

onMounted(() => {
  const element = btnRef.value ? btnRef.value.$el || btnRef.value : undefined;
  mode.value = resolveCssVariableVariant('--pa-icon-variant', iconVariants, element);
});

function iconUrl(provider: string){
  return `https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/${provider}.svg`
}

const iconLink = typeof props.connection === 'string'
  ? iconUrl(props.connection)
  : props.connection.branding?.logo_url || iconUrl(props.connection.provider)

const providerLabel = computed(() => typeof props.connection === 'string'
  ? props.connection
  : props.connection.branding?.display_name || props.connection.provider)

</script>

<style scoped>

</style>
