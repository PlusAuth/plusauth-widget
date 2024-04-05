<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div v-if="!actionCompleted">
      <div class="pa__logo-container">
        <img
          class="pa__logo"
          alt="Logo"
          :src="resolveClientLogo(context.client)"
        >
      </div>

      <div class="pa__widget-info-section">
        <h1 v-t="'forgotPassword.title'" />
        <h2 v-t="'forgotPassword.subtitle'" />
      </div>

      <GenericForm
        ref="form"
        :fields="fields"
        :validate="validate"
        :submit="submit"
      />

      <div class="pa__widget-content-actions">
        <p-btn
          color="primary"
          :loading="loading"
          block
          @click="submit"
        >
          <span v-t="'common.submit'" />
        </p-btn>
      </div>
    </div>
    <template v-else>
      <div class="pa__column">
        <div class="pa__logo-container">
          <img
            src="https://static.plusauth.com/images/icons/plane.svg"
            class="pa__logo"
            alt="Mail Confirmation"
          >
        </div>
        <div class="pa__widget-info-section">
          <h2 v-t="{ path: 'forgotPassword.emailSent', args: {email: fields.email.value } }" />
        </div>
      </div>
    </template>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'ForgotPassword',
  components: { GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()

    const actionCompleted = ref(false)

    const defaultFields: AdditionalFields = {
      email: {
        type: 'text',
        format: 'email',
        label: 'common.fields.email'
      }
    }

    const { form, loading, submit, validate, fields } = useGenericForm(
      'recovery',
      defaultFields,
      async (values, finalFields) => {
        try{
          await http.post({ body: values })
          actionCompleted.value= true
        }catch (e) {
          if(finalFields.email && e.error === 'user_not_found') {
            finalFields.email.errors = `errors.${e.error}`
          } else {
            throw e
          }
          switch (e.error) {
            case 'user_not_found':
              if(finalFields.email){
                finalFields.email.errors = `errors.${e.error}`
              } else {
                throw e
              }
              break;
            // TODO: email not verified
            // case 'email_not_verified':
              // break;
            default:
              throw e
          }

        }
      })

    return {
      fields,
      context,
      form,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate,
      submit
    }
  },
})
</script>

<style scoped>

</style>
