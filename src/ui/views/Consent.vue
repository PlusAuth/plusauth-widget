<template>
  <WidgetLayout
    :title="{
      path: 'consent.title',
      args: { clientName: context.client.clientName }
    }"
  >
    <ul class="groups">
      <li
        v-if="requested.base?.length"
        class="group"
      >
        <span
          v-t="'consent.groups.base'"
          class="group-label"
        />
        <ul>
          <li
            v-for="scope in requested.base"
            :key="scope"
          >
            {{ te(`consent.base_scopes.${scope}`) ? t(`consent.base_scopes.${scope}`) : scope }}
          </li>
        </ul>
      </li>

      <li
        v-if="requested.claims?.length"
        class="group"
      >
        <span
          v-t="'consent.groups.claims'"
          class="group-label"
        />
        <ul>
          <li
            v-for="claim in requested.claims"
            :key="claim"
          >
            {{ te(`consent.claims.${claim}`) ? t(`consent.claims.${claim}`) : claim }}
          </li>
        </ul>
      </li>

      <template v-if="requested.resources">
        <li
          v-for="(scopes, indicator) in requested.resources"
          :key="indicator"
          class="group"
        >
          <span class="group-label">{{
            te(`consent.resources.${indicator}`)
              ? t(`consent.resources.${indicator}`)
              : indicator
          }}</span>
          <ul>
            <li
              v-for="scope in scopes"
              :key="`${indicator}:${scope}`"
            >
              {{ te(`consent.scopes.${scope}`) ? t(`consent.scopes.${scope}`) : scope }}
            </li>
          </ul>
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
import { defineComponent } from 'vue'

import WidgetLayout from '../components/WidgetLayout.vue'
import { useContext, useHttp, useLocale } from '../composables'
import { resolveLogo } from '../utils'

type Requested = {
  base?: string[]
  claims?: string[]
  resources?: Record<string, string[]>
}

export default defineComponent({
  name: 'Consent',
  components: { WidgetLayout },
  setup() {
    const http = useHttp()
    const { t, te } =useLocale()
    const context = useContext()

    const requested = (context.details.requested ?? {}) as Requested

    return {
      t,
      te,
      context,
      requested,
      resolve: (response: boolean) => http.post({ body: { accepted: response } }),
      resolveClientLogo: resolveLogo,
    }
  },
})
</script>

<style scoped>
.groups {
  padding: 0;
  list-style: none;
}

.group {
  margin-top: 12px;
}

.group-label {
  display: block;
  font-weight: 600;
  opacity: 0.6;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
</style>
