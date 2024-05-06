<template>
  <WidgetLayout
    :title="{
      path: 'consent.title',
      args: { clientName: context.client.clientName}
    }"
  >
    <ul>
      <template
        v-for="scope in scopes"
        :key="scope"
      >
        <li>
          {{ scope }}
        </li>
      </template>
    </ul>
    <template #content-actions>
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
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import { resolveLogo } from '../utils';

export default defineComponent({
  name: 'Consent',
  components: { WidgetLayout },
  setup(){
    const http = useHttp()
    const context = useContext()

    const scopes = [...context.details.scopes?.new || []]
    return {
      scopes,
      context,
      resolve(response){
        return http.post({ body: { accepted: response } })
      },
      resolveClientLogo: resolveLogo,
    }
  }
})
</script>

<style scoped>

</style>
