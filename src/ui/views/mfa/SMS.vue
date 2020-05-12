<template>
  <p-form
    ref="form"
    class="text-center"
    autocomplete="off"
    @submit="submit"
  >
    <img
      id="mainLogo"
      style="max-height: 150px; margin-left: 40px;"
      class="logo"
      alt="Logo"
      src="/images/icons/message-on-phone.svg"
    >
    <PTimer
      v-if="timerEnabled"
      :duration="120"
    />
    <div
      v-t="{ path: 'mfa.sms.title', args: { phone_number:
        context.details.phone_number
      } }"
      class="subtitle-2 text-left"
    />
    <p-text-field
      v-model="code"
      label="mfa.sms.code"
      :error-messages="error"
      :rules="[
        v => !!v ? true : 'mfa.sms.errors.codeRequired'
      ]"
    />

    <p-btn
      type="submit"
      block
      color="primary"
      :loading="loading"
    >
      <span v-t="'mfa.sms.submit'" />
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
import PlusAuth from 'plusauth-web';
import { defineComponent, inject, ref } from 'vue';

import PTimer from '../../components/PTimer';

export default defineComponent({
  name: 'SMS',
  components: { PTimer },
  props: {
    timerEnabled: {
      type: Boolean as () => boolean,
      default: true
    }
  },
  setup(){
    const api = inject('api') as PlusAuth
    const code = ref<string | null>(null)
    const error = ref<string>(null as any)
    const form = ref(null as any)
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
                'sms'
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
