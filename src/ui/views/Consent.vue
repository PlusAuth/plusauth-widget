<template>
  <div class="col elevation-1 pa__8">
    <p-form
      ref="form"
      class="text-center"
      method="post"
      autocomplete="off"
      :action="formAction()"
      @submit="submit"
    >
      <img
        style="max-height: 150px"
        class="logo"
        alt="Logo"
        :src="resolveClientLogo(context.client)"
      >
      <div class="pa__form-title">
        <span v-t="'consent.title'" />
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
          type="submit"
        >
          <span v-t="'consent.allow'" />
        </p-btn>
        <p-btn
          color="error"
          type="submit"
        >
          <span v-t="'consent.reject'" />
        </p-btn>
      </div>
    </p-form>
  </div>
</template>

<script lang="ts" >
import { defineComponent, reactive } from 'vue';

import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'Consent',
  props: {
    scopes: {
      type: Array,
      default: () => ['test', 'test2']
    }
  },
  setup(props){

    return {
      resolveClientLogo,

      formAction(){
        return '/signup'
      },
      async submit($event: Event){
        $event.preventDefault()
        // @ts-ignore
        const valid = this.$refs.form?.validate()
        if(valid){
          //  TODO: submit
        }
      }
    }
  }
})
</script >

<style scoped >

</style >
