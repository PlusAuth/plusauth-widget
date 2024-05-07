<template>
  <WidgetLayout
    :logo="false"
    :title="isRegistration ? 'passwordless.push.enrollTitle'
      : manualMode ? 'mfa.otp.title' : 'passwordless.push.title'"
    :subtitle="isRegistration ? 'passwordless.push.enrollDescription'
      : manualMode ? ''
        : context.details.push_code ?
          'passwordless.push.selectCode': 'passwordless.push.description'
    "
  >
    <img
      v-if="isRegistration"
      id="mainLogo"
      class="pa__logo pa__qr-code"
      alt="Logo"
      :src="context.details.dataUrl"
    >
    <div
      v-else-if="!manualMode && context.details.push_code"
      class="pa__timer pa__timer--circle"
    >
      <span class="pa__timer--seconds">
        {{ context.details.push_code }}
      </span>
    </div>
    <GenericForm
      ref="form"
      :fields="fields"
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
    <template #content-actions>
      <p-btn
        v-if="manualMode || isRegistration"
        block
        color="primary"
        :loading="loading"
        @click="manualMode ? submit : reload"
      >
        <span v-t="manualMode ? 'common.submit': 'common.continue'" />
      </p-btn>
    </template>
    <template
      v-if="!manualMode"
      #content-footer
    >
      <p
        v-if="!isRegistration"
      >
        <a
          v-t="'passwordless.push.tryCodeAction'"
          @click="switchToCode"
        />
      </p>
      <p>
        <span
          v-t="['common.resendText', { type: 'common.notification'}]"
          style="padding-right: 4px"
        />
        <a
          v-t="'common.resend'"
          :href="resendLink"
        />
      </p>
    </template>
  </WidgetLayout>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import PSpinner from '../../components/PSpinner/PSpinner';
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext, useHttp, useLocale } from '../../composables';
import type { AdditionalFields } from '../../interfaces';
import { useGenericForm } from '../../utils/form_generics';

export default defineComponent({
  name: 'Push',
  components: { WidgetLayout, PSpinner,  GenericForm },
  setup(){
    const http = useHttp()
    const context = useContext()
    const i18n = useLocale()

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
              'innerHtml': i18n.t('common.edit')
            }
          }
        }
      },
      ...manualMode.value ? {
        code: {
          type: 'number',
          label: 'common.enterOtp',
          value: null,
        }
      }: undefined
    }))

    const { form, loading, submit, fields, validate, formErrorHandler } = useGenericForm(
      'passwordlessPush',
      defaultFields,
      async (values) => {
        await http.post({ body: values })
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
      // eslint-disable-next-line vue/valid-next-tick
      await nextTick(async () => {
        if(!newValue && !manual){
          loading.value = true;
          try {
            await new Promise( (resolve, reject) => {
              pollPushValidation(resolve, reject)
            })
          } catch (e) {
            formErrorHandler(e)
          }finally {
            loading.value = false
          }
        }
      })

    }, { immediate: true, flush: 'post' } )
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
