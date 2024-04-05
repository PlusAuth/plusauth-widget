<template>
  <div class="pa__logo-container">
    <img
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
  </div>
  <div class="pa__widget-info-section">
    <h2
      v-t="{ path: 'consent.title',
             args: { clientName: context.client.clientName}
      }"
    />
  </div>

  <div class="pa__column">
    <template
      v-for="scope in _scopes"
      :key="scope"
    >
      <li>
        {{ scope }}
      </li>
    </template>
  </div>

  <div class="pa__widget-content-actions">
    <p-btn
      color="success"
      @click="resolve(true)"
    >
      <span v-t="'common.allow'" />
    </p-btn>
    <div style="padding: 4px" />
    <p-btn
      class="pa__ml-2"
      color="error"
      @click="resolve(false)"
    >
      <span v-t="'common.reject'" />
    </p-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useContext, useHttp } from '../composables';
import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'Consent',
  setup(){
    const http = useHttp()
    const context = useContext()

    const _scopes = [...context.details.scopes?.new || []]
    return {
      _scopes,
      context,
      resolve(response){
        return http.post({ body: { accepted: response } })
      },
      resolveClientLogo,
    }
  }
})
</script>

<style scoped>

</style>
