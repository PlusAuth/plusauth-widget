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
      class="pa__challenge-timer"
      :duration="120"
    />
    <h2 v-t="{ path: 'mfa.sms.title', args: { phone_number: context.details.phone_number} }" />
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
	<div class="pa__widget-content-footer">
		<p align="center">
      <span
				v-t="['common.resendText', {type: 'common.code'}]"
				style="padding-right: 4px"
			/><a
			v-t="'common.resend'"
			:href="resendLink"
		/>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PTimer from '../../components/PTimer/PTimer';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'SMS',
  components: { PTimer, GenericForm },
  setup(){

    const http = useHttp()
    const context = useContext()

		const resendLink = `${ window.location.pathname }/resend`

		const defaultFields: AdditionalFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    }
    const { form, loading, submit, validate, fields } = useGenericForm(
      'smsMfa',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
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
