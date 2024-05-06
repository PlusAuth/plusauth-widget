<template>
  <WidgetLayout
    logo="images/icons/email_question.svg"
    :title="{ path: 'mfa.email.title', args: { email: context.details.email } }"
  >
    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    />
    <template #content-actions>
      <p-btn
        block
        color="primary"
        :loading="loading"
        @click="submit"
      >
        <span v-t="'common.submit'" />
      </p-btn>
    </template>
    <template #content-footer>
      <p
        v-if="context.details.challenges.length > 1"
      >
        <a
          v-t="'mfa.tryAnotherWay'"
          href="/signin/challenge"
        />
      </p>
      <p>
        <span
          v-t="['common.resendText', {type: 'common.email'}]"
          style="padding-right: 4px"
        /><a
          v-t="'common.resend'"
          :href="resendLink"
        />
      </p>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';


export default defineComponent({
  name: 'Email',
  components: { WidgetLayout, GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()

    const resendLink = `${ window.location.pathname }/resend`

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.enterOtp'
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
      resendLink,
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
