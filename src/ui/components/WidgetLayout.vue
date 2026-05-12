<script setup lang="ts">
import { inject } from 'vue';

import { useContext } from '../composables';

import type { ITranslatePath } from '../interfaces';
import { resolveLogo } from '../utils';

import { getInitials, getUserInitials } from '../utils/user.ts';

import Avatar from './Avatar.vue';
import PFooter from './Footer.vue';
import WidgetTemplate from './WidgetTemplate.tsx';

const props = withDefaults( defineProps<{
  logo?: string | boolean,
  title?: ITranslatePath
  logoStyle?: any,
  subtitle?: ITranslatePath
}>(), {
  logo: true
})
const context = useContext()

const templates = inject<Record<string, any>>('templates') || {}

const logoSource = resolveLogo(typeof props.logo === 'string' ? props.logo : context.client)
</script>

<template>
  <div class="pa__widget-content">
    <div class="pa__widget-content-main">
      <WidgetTemplate name="content-prepend" />
      <slot
        name="logo"
      >
        <div
          v-if="logo"
          class="pa__logo-container"
        >
          <img
            v-if="logoSource"
            class="pa__logo"
            :style="logoStyle"
            alt="Logo"
            :src="resolveLogo(typeof logo === 'string' ? logo : context.client)"
          >
          <Avatar
            v-else
            :initials="getInitials(context.client?.clientName)"
            :picture="logoSource"
          />
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
        v-if="$slots['content-actions'] || templates['content-actions-prepend'] || templates['content-actions-append']"
        class="pa__widget-content-actions"
      >
        <div
          v-if="templates['content-actions-prepend']"
          class="pa__widget-content-actions-template pa__widget-content-actions-template-prepend"
        >
          <WidgetTemplate name="content-actions-prepend" />
        </div>
        <div
          v-if="$slots['content-actions']"
          class="pa__widget-content-actions-main"
        >
          <slot name="content-actions" />
        </div>
        <div
          v-if="templates['content-actions-append']"
          class="pa__widget-content-actions-template pa__widget-content-actions-template-append"
        >
          <WidgetTemplate name="content-actions-append" />
        </div>
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
