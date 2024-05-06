<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <WidgetLayout
      v-if="!actionCompleted"
      title="forgotPassword.title"
      subtitle="forgotPassword.subtitle"
    >
      <GenericForm
        ref="form"
        :fields="fields"
        :validate="validate"
        :submit="submit"
      />

      <template #content-actions>
        <p-btn
          color="primary"
          :loading="loading"
          block
          @click="submit"
        >
          <span v-t="'common.submit'" />
        </p-btn>
      </template>
    </WidgetLayout>
    <WidgetLayout
      v-else
      :subtitle="{ path: 'forgotPassword.emailSent', args: {email: fields.email.value } }"
      logo="images/icons/plane.svg"
    />
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import GenericForm from '../components/GenericForm.vue';
import WidgetLayout from '../components/WidgetLayout.vue';
import { useContext, useHttp } from '../composables';
import type { AdditionalFields } from '../interfaces';
import { resolveLogo } from '../utils';
import { useGenericForm } from '../utils/form_generics';

export default defineComponent({
  name: 'ForgotPassword',
  components: { WidgetLayout, GenericForm },
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
      resolveClientLogo: resolveLogo,
      validate,
      submit
    }
  },
})
</script>

<style scoped>

</style>
