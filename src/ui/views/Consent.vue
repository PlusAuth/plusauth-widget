<template>
  <p-form
    class="text-center"
    autocomplete="off"
    @submit.prevent
  >
    <img
      style="max-height: 150px"
      class="logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
    <div class="title">
      <span
        v-t="{ path: 'consent.title',
               args: { clientName: context.client.clientName}
        }"
      />
    </div>

    <div class="text-left">
      <template v-for="scope in scopes">
        <li :key="scope">
          {{ scope }}
        </li>
      </template>
    </div>

    <div class="pt-4">
      <p-btn
        color="success"
        @click="allow"
      >
        <span v-t="'consent.allow'" />
      </p-btn>
      <p-btn
        color="error"
        @click="reject"
      >
        <span v-t="'consent.reject'" />
      </p-btn>
    </div>
  </p-form>
</template>

<script lang="ts" >
import PlusAuth from 'plusauth-web';
import { defineComponent, inject } from 'vue';

import { resolveClientLogo } from '../utils';


export default defineComponent({
  name: 'Consent',
  props: {
    scopes: {
      type: Array,
      default: () => ['test', 'test2']
    }
  },
  setup(){
    const api = inject('api') as PlusAuth
    const context = inject('context') as any

    return {
      context,
      submit: api.auth.acceptConsent,
      reject: api.auth.rejectConsent,
      resolveClientLogo,
    }
  }
})
</script >

<style scoped >

</style >
