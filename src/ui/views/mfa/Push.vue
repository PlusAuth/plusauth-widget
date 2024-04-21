<template>
  <template v-if="isRegistration">
    <div class="pa__widget-info-section">
      <h1 v-t="'mfa.push.enrollTitle'" />
      <p
        v-t="{ path: 'passwordless.push.enrollDescription'}"
        class="pa__subtitle-2 pa__text-left"
        style="margin: 12px 0"
      />
    </div>
    <div class="pa__logo-container">
      <img
        id="mainLogo"
        class="pa__logo pa__qr-code"
        alt="Logo"
        style="max-width: 300px; max-height: 300px;"
        :src="context.details.dataUrl"
      >
    </div>
    <div class="pa__widget-content-actions">
      <p-btn
        block
        color="primary"
        :loading="loading"
        @click="reload"
      >
        <span v-t="'common.continue'" />
      </p-btn>
    </div>
  </template>
  <template v-else>
    <div class="pa__widget-info-section">
      <h1 v-t="'mfa.push.title'" />
      <p
        v-t="{
          path: !manualMode && context.details.push_code ?
            'mfa.push.selectCode': 'mfa.push.description'
        }"
        class="pa__subtitle-2 pa__text-left"
        style="margin: 12px 0"
      />
    </div>

    <GenericForm
      ref="form"
      :fields="fields"
      :validate="validate"
      :submit="submit"
    >
      <template v-if="!manualMode">
        <div
          v-if="context.details.push_code"
          class="pa__timer pa__timer--circle"
        >
          <span class="pa__timer--seconds">
            {{ context.details.push_code }}
          </span>
        </div>
        <div
          v-for="device in context.details.devices"
          :key="device.model"
          style="border: 1px solid; padding: 12px; display: flex; align-items: center"
        >
          <PSpinner
            v-if="loading"
            indeterminate
          />
          <span style="margin-left: 12px">{{ device.vendor }} {{ device.model }}</span>
        </div>
      </template>
    </GenericForm>


    <div
      v-if="manualMode"
      class="pa__widget-content-actions"
    >
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
    <div
      v-if="!manualMode"
			class="pa__widget-content-footer"
    >
      <p
        v-if="!isRegistration"
        align="center"
      >
        <a
          v-t="'mfa.push.tryCodeAction'"
          @click="switchToCode"
        />
      </p>
      <p  align="center">
        <span
          v-t="['common.resendText', { type: 'common.notification'}]"
          style="padding-right: 4px"
        />
        <a
          v-t="'common.resend'"
          :href="resendLink"
        />
      </p>
    </div>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PSpinner from '../../components/PSpinner/PSpinner';
import { useContext, useHttp } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'Push',
  components: { PSpinner, GenericForm },
  setup() {

    const http = useHttp()
    const context = useContext()

    const resendLink = `${window.location.pathname}/resend`

    const urlParams = new URLSearchParams(window.location.search)
    const manualMode = computed(() => urlParams.get('useQuery') === 'true')

    const isRegistration = ref(!!context.details.dataUrl)

    const code = ref<string>(null as any)
    const error = ref<string>(null as any)

    const defaultFields = computed<AdditionalFields>(() => ({
      ...manualMode.value ? {
        code: {
          type: 'code',
          value: null,
        }
      } : undefined
    }))

    const { form, loading, submit, fields, validate, formErrorHandler } = useGenericForm(
      'pushMfa',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
      }
    )

    async function pollPushValidation(resolve, reject) {
      try {
        resolve(await http.post({
          body: {}
        }))
      } catch (e) {
        if (e.error === 'authorization_pending') {
          setTimeout(() => pollPushValidation(resolve, reject), 3000)
        } else if(e.error === 'invalid_code') {
          form.value.toggleAlert({
            path: `errors.${e.error}`,
            args: e
          })
          loading.value = false;
        } else {
          reject(e)
        }
      }
    }

    watch([isRegistration, manualMode], async ([newValue, manual]) => {
      await nextTick(async () => {
        if (!newValue && !manual) {
          loading.value = true;
          try {
            await new Promise((resolve, reject) => {
              pollPushValidation(resolve, reject)
            })
          } catch (e) {
            formErrorHandler(e)
          } finally {
            loading.value = false
          }
        }
      })

    }, { immediate: true, flush: 'post' })
    return {
      fields,
      resendLink,
      validate,
      isRegistration,
      manualMode,
      code,
      context,
      error,
      form,
      loading,
      submit,
      switchToCode(){
        urlParams.set('useQuery', 'true')
        window.location.search = urlParams.toString();
      },
      reload(){
        window.location.reload()
      }
    }
  }
})
</script>

<style scoped>

</style>
