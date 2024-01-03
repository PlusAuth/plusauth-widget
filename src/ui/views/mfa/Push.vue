<template>
  <template v-if="isRegistration">
    <div class="pa__widget-info-section">
      <h1 v-t="'passwordless.push.enrollTitle'" />
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
        @click="isRegistration = false"
      >
        <span v-t="'common.continue'" />
      </p-btn>
    </div>
  </template>
  <template v-else>
    <div class="pa__widget-info-section">
      <h1 v-t="'passwordless.push.title'" />
      <p
        v-t="{ path: 'passwordless.push.description'}"
        class="pa__subtitle-2 pa__text-left"
        style="margin: 12px 0"
      />
    </div>

    <GenericForm
      ref="form"
      :fields="finalFields"
      :validate="validate"
      :submit="submit"
    >
      <template v-if="!manualMode">
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
      class="pa__widget-content-footer"
    >
      <p
        v-if="!isRegistration && !manualMode"
        align="center"
      >
        <a
          v-t="'passwordless.push.tryCodeAction'"
          @click="$router.push({ query: { useCode: 'true' } })"
        />
      </p>
      <p align="center">
        <span
          v-t="'passwordless.push.tryCodeText'"
          style="padding-right: 4px"
        />

        <a
          v-t="'verifyEmail.resendAction'"
          :href="resendLink"
        />
      </p>
    </div>
  </template>
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
import { computed, defineComponent, inject, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import GenericForm from '../../components/GenericForm.vue';
import PSpinner from '../../components/PSpinner/PSpinner';
import type { AdditionalFields, IPlusAuthContext } from '../../interfaces';
import { CustomizableFormProps } from '../../utils/customizable_form';
import type { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'Push',
  components: { PSpinner, GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props) {
    const route = useRoute()

    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator

    const manualMode = computed(() => route.query.useCode === 'true')
    const isRegistration = ref(!!context.details.dataUrl)
    const code = ref<string>(null as any)
    const error = ref<string>(null as any)
    const resendLink = `${window.location.pathname}/resend`

    const defaultFields = computed<AdditionalFields>(() => ({
      ...manualMode.value ? {
        code: {
          type: 'code',
          value: null,
        }
      } : undefined
    }))

    async function pollPushValidation(resolve, reject) {
      try {
        resolve(await http.post({
          body: {}
        }))
      } catch (e) {
        if (e.error === 'authorization_pending') {
          setTimeout(() => pollPushValidation(resolve, reject), 3000)
        } else {
          reject(e)
        }
      }
    }

    const { form, loading, submit, fields: finalFields, validate } = form_generics.call(
      props,
      defaultFields,
      async (values) => {
        try {
          await http.post({ body: values })
        } catch (e) {
          form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message, {
            dismissible: false
          })
          throw e
        }
      }
    )

    watch([isRegistration, manualMode], async ([newValue, manual]) => {
      nextTick(async () => {

        if (!newValue && !manual) {
          loading.value = true;
          try {
            await new Promise((resolve, reject) => {
              pollPushValidation(resolve, reject)
            })
          } catch (e) {
            form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message || e, {
              dismissible: false
            })
          } finally {
            loading.value = false
          }
        }
      })

    }, { immediate: true, flush: 'post' })
    return {
      finalFields,
      resendLink,
      validate,
      isRegistration,
      manualMode,
      code,
      context,
      error,
      form,
      loading,
      submit
    }
  }
})
</script>

<style scoped>

</style>
