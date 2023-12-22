<template>
  <div class="pa__logo-container">
    <img
      id="mainLogo"
      style="margin-left: 30px;"
      class="pa__logo"
      alt="Logo"
      src="https://static.plusauth.com/images/icons/message-on-phone.svg"
    >
  </div>
  <div class="pa__widget-info-section">
    <PTimer
      v-if="timerEnabled"
      class="pa__challenge-timer"
      :duration="120"
    />
    <h2 v-t="{ path: 'mfa.sms.title', args: { phone_number: context.details.phone_number} }" />
  </div>

  <GenericForm
    ref="form"
    :fields="finalFields"
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
import PTimer from '../../components/PTimer/PTimer';
import type { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../utils/customizable_form';
import type { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';

export default defineComponent({
  name: 'SMS',
  components: { PTimer, GenericForm },
  props: {
    timerEnabled: {
      type: Boolean as () => boolean,
      default: true
    },
    ...CustomizableFormProps
  },
  setup(props){
    const http = inject('http') as FetchWrapper
    const context = inject('context') as any

    const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields: finalFields } = form_generics.call(
      props,
      defaultFields,
      async (values) => {
        try{
          await http.post({ body: values })
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
      finalFields,
      form,
      context,
      validate,
      submit
    }
  }
})
</script>
