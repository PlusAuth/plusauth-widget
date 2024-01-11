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
        @click="reload"
      >
        <span v-t="'common.continue'" />
      </p-btn>
    </div>
  </template>
  <template v-else>
    <div class="pa__widget-info-section">
      <h1 v-t="'passwordless.push.title'" />
      <p
        v-t="{
          path: manualMode ? 'passwordless.otp.title' : context.details.push_code ?
            'passwordless.push.selectCode': 'passwordless.push.description'
        }"
        class="pa__subtitle-2 pa__text-left"
        style="margin: 12px 0"
      />
    </div>
    <div
      v-if="!manualMode && context.details.push_code"
      class="pa__timer pa__timer--circle"
    >
      <span class="pa__timer--seconds">
        {{ context.details.push_code }}
      </span>
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
      v-if="!manualMode"
      class="pa__widget-content-footer"
    >
      <p
        v-if="!isRegistration"
        align="center"
      >
        <a
          v-t="'passwordless.push.tryCodeAction'"
          @click="switchToCode"
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
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, ref, watch } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PSpinner from '../../components/PSpinner/PSpinner';
import type { AdditionalFields, IPlusAuthContext, IWidgetSettings } from '../../interfaces';
import type { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'Push',
  components: { PSpinner,  GenericForm },
  setup(){
    const http = inject('http') as FetchWrapper
    const context = inject('context') as IPlusAuthContext
    const translator = inject(translatorKey) as Translator
    const settings = inject('settings') as Partial<IWidgetSettings>

    const resendLink = `${window.location.pathname }/resend`

    const urlParams = new URLSearchParams(window.location.search)
    const manualMode = computed(() => urlParams.get('useQuery') === 'true')

    const isRegistration = ref(!!context.details.dataUrl)

    const code = ref<string>(null as any)
    const error = ref<string>(null as any)

    const defaultFields = computed<AdditionalFields>(() => ({
      email: {
        type: 'text',
        value: context.details.email,
        attrs: { readOnly: true },
        slots: {
          append: {
            element: 'button',
            props: {
              type: 'button',
              class: 'pa__btn pa__btn--flat pa__pw-toggle-visibility',
              onClick: (e) => {
                e.preventDefault()
                window.location.assign('/signin')
              },
              'innerHtml': translator.t('common.edit')
            }
          }
        }
      },
      ...manualMode.value ? {
        code: {
          type: 'code',
          value: null,
        }
      }: undefined
    }))

    const { form, loading, submit, fields: finalFields, validate } = form_generics.call(
      (settings.modeOptions || {}).passwordlessPush,
      defaultFields,
      async (values) => {
        try{
          await http.post({ body: values })
        }catch (e) {
          form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message, {
            dismissible: false
          })
          throw e
        }
      }
    )

    async function pollPushValidation(resolve, reject){
      try{
        resolve(await http.post({
          body: {}
        }))
      }catch (e) {
        if (e.error === 'authorization_pending') {
          setTimeout(() => pollPushValidation(resolve, reject), 3000)
        } else if(e.error === 'invalid_code') {
          form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message, {
            dismissible: false
          })
          loading.value = false;
        } else {
          reject(e)
        }
      }
    }

    watch([isRegistration, manualMode], async ([newValue, manual]) => {
      nextTick(async () => {

        if(!newValue && !manual){
          loading.value = true;
          try {
            await new Promise( (resolve, reject) => {
              pollPushValidation(resolve, reject)
            })
          } catch (e) {
            form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message || e, {
              dismissible: false
            })
          }finally {
            loading.value = false
          }
        }
      })

    }, { immediate: true, flush: 'post' } )
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
      submit,
      switchToCode(){
        urlParams.set('useQuery', true)
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
