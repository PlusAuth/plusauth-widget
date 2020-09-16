<template>
  <p-form
    class="pa__text-center"
    autocomplete="off"
    @submit.prevent
  >
    <img
      style="max-height: 150px"
      class="pa__logo"
      alt="Logo"
      :src="resolveClientLogo(context.client)"
    >
    <div class="pa__title">
      <span
        v-t="{ path: 'consent.title',
               args: { clientName: context.client.clientName}
        }"
      />
    </div>

    <div class="pa__text-left">
      <template
        v-for="scope in _scopes"
        :key="scope"
      >
        <li>
          {{ scope }}
        </li>
      </template>
    </div>

    <div class="pa__pt-4">
      <p-btn
        color="pa__success"
        @click="allow"
      >
        <span v-t="'consent.allow'" />
      </p-btn>
      <p-btn
        class="pa__ml-2"
        color="pa__error"
        @click="reject"
      >
        <span v-t="'consent.reject'" />
      </p-btn>
    </div>
  </p-form>
</template>

<script lang="ts" >
import { PlusAuthWeb } from '@plusauth/web';
import { defineComponent, inject } from 'vue';

import { resolveClientLogo } from '../utils';


export default defineComponent({
  name: 'Consent',
  props: {
    scopes: {
      type: Array,
      default: () => []
    }
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any

    const _scopes = [...props.scopes, ...context.details.scopes?.new || []]
    return {
      _scopes,
      context,
      allow(){
        return api.auth.acceptConsent()
      },
      reject(){
        return api.auth.rejectConsent()
      } ,
      resolveClientLogo,
    }
  }
})
</script >

<style scoped >

</style >
