<script setup lang="ts">
import { inject, defineProps, withDefaults } from 'vue'

import { useContext } from '../composables';

import type { ITranslatePath } from '../interfaces';
import { resolveLogo } from '../utils';

import PFooter from './Footer.vue';
import WidgetTemplate from './WidgetTemplate.tsx';

withDefaults( defineProps<{
  logo?: string | boolean,
  title?: ITranslatePath
  logoStyle?: any,
  subtitle?: ITranslatePath
}>(), {
  logo: true
})
const context = useContext()

const templates = inject('templates')
</script>

<template>
  <div class="pa__widget-content">
    <div class="pa__widget-content-main">
      <WidgetTemplate name="content-prepend" />
      <slot
        name="logo"
      >
        <div
          v-if="logo && context.client?.logoUri"
          class="pa__logo-container"
        >
          <img
            class="pa__logo"
            :style="logoStyle"
            alt="Logo"
            :src="resolveLogo(typeof logo === 'string' ? logo : context.client)"
          >
        </div>
      </slot>
      <div class="pa__widget-info-section">
        <slot name="title">
          <h1
            v-t="title"
          />
          <h2
            v-if="subtitle"
            v-t="subtitle"
          />
        </slot>
        <slot name="info" />
        <WidgetTemplate name="info-append" />
      </div>
      <slot />
      <div
        v-if="$slots['content-actions']"
        class="pa__widget-content-actions"
      >
        <slot name="content-actions" />
      </div>
      <slot name="content-append" />
      <WidgetTemplate name="content-append" />
      <div
        v-if="$slots['content-footer'] || templates['content-footer']"
        class="pa__widget-content-footer"
      >
        <slot name="content-footer" />
        <WidgetTemplate name="content-footer" />
      </div>
    </div>
    <PFooter class="pa__widget-footer" />
  </div>
</template>

<style scoped>

</style>
