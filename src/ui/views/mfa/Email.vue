<template>
  <div class="pa__logo-container">
    <img
      id="mainLogo"
      class="pa__logo"
      alt="Logo"
      src="https://static.plusauth.com/images/icons/email_question.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <h2
      v-t="{ path: 'mfa.email.title', args: { email: context.details.email } }"
    />
  </div>

  <GenericForm
    ref="form"
    :fields="fields"
    :validate="validate"
    :submit="submit"
  />

  <div class="pa__widget-content-actions">
    <p-btn
      block
      color="primary"
      :loading="loading"
      @click="submit"
    >
      <span v-t="'common.submit'" />
    </p-btn>
  </div>

  <div
    v-if="context.details.challenges.length > 1"
    class="pa__widget-helpers-section"
  >
    <a
      v-t="'mfa.tryAnotherWay'"
      href="/signin/challenge"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import type { AdditionalFields, IPlusAuthContext, IWidgetSettings } from '../../interfaces';
import type { FetchWrapper } from '../../utils/fetch';
import { useGenericForm } from '../../utils/form_generics';


export default defineComponent({
  name: 'Email',
  components: { GenericForm },
  setup(){
    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext
    const settings = inject('settings') as Partial<IWidgetSettings>

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields } = useGenericForm(
      'emailMfa',
      defaultFields,
      async (values, finalFields) => {
        try{
          await http.post({
            body: values
          })
        }catch (e) {
          if (e.error) {
            form.value.toggleAlert(`errors.${e.error}`, {
              dismissible: false
            })
          }
          throw e
        }
      }
    )
    return {
      loading,
      fields,
      form,
      context,
      validate,
      submit
    }
  }
})
</script>

<style scoped>

</style>
