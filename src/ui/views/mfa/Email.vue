<template>
  <p-form class="text-center">
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="logo"
      alt="Logo"
      src="/images/icons/email_question.svg"
    >
    <div
      v-t="{ path: 'mfa.email.title', args: { email: context.details.email
      } }"
      class="subtitle-2 text-left"
    />
    <p-text-field
      v-model="code"
      label="mfa.email.code"
      :error-messages="error"
      :rules="[
        v => !!v ? true : 'mfa.email.errors.codeRequired'
      ]"
    />

    <p-btn
      type="submit"
      block
      color="primary"
      :loading="loading"
    >
      <span v-t="'mfa.email.submit'" />
    </p-btn>

    <div
      v-if="context.details.challenges.length > 1"
      class="row justify-center pt-4"
    >
      <a
        v-t="'mfa.tryAnotherWay'"
        href="/signin/challenge"
      />
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-js';
import { defineComponent, inject, ref } from 'vue';

import { PForm } from '../../components';


export default defineComponent({
  name: 'Email',
  setup(){
    const api = inject('api') as PlusAuth
    const code = ref<string | null>(null)
    const error = ref<string>(null as any)
    const form = ref<InstanceType<typeof PForm>>(null as any)
    const loading = ref(false)
    return {
      code,
      loading,
      error,
      form,
      async submit($event: Event){
        $event.preventDefault()

        loading.value = true

        const valid = form.value?.validate()
        if(valid){
          form.value?.resetValidation()
          try{
            await api.mfa.validateCode(
              code.value as string,
              'email'
            )
          }catch (e) {
            error.value = e.error;
          }finally {
            loading.value = false
          }
          return false
        }else{
          loading.value = false
        }
      }
    }
  }
})
</script >

<style scoped >

</style >
