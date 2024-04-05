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
import { defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';


export default defineComponent({
  name: 'Email',
  components: { GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields } = useGenericForm(
      'emailMfa',
      defaultFields,
      async (values) => {
        await http.post({
          body: values
        })
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
