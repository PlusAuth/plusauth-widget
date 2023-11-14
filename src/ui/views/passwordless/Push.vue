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
          style="border: 1px solid; padding: 12px; display: flex; align-items: center"
        >
          <PLoading
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
      v-else
      class="pa__widget-content-footer"
    >
      <p align="center">
        <a
          v-t="'passwordless.push.tryCodeAction'"
          class="pa__primary--text"
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
          class="pa__primary--text"
          :href="resendLink"
        />
      </p>
    </div>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import GenericForm from '../../components/GenericForm.vue';
import PLoading from '../../components/PLoading';
import { AdditionalFields } from '../../interfaces';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import { FetchWrapper } from '../../utils/fetch';
import form_generics from '../../utils/form_generics';
import { Translator, translatorKey } from '../../utils/translator';

export default defineComponent({
  name: 'Push',
  components: { PLoading,  GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const route = useRoute()

    const http = inject('http') as FetchWrapper
    const context = inject('context') as any
    const translator = inject(translatorKey) as Translator

    const manualMode = computed(() => route.query.useCode === 'true' )
    const isRegistration = ref(!!context.details.dataUrl)
    const code = ref<string>(null as any)
    const error = ref<string>(null as any)
    const resendLink = `${window.location.pathname }/resend`

    const defaultFields = computed<AdditionalFields>(() => ({
      email: {
        type: 'text',
        value: context.details.email,
        attrs: { readOnly: true },
        slots: {
          append: {
            element: 'button',
            props: {
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
    async function pollPushValidation(resolve, reject){
      try{
        resolve(await http.post(window.location.pathname, {
          body: {}
        }))
      }catch (e) {
        if (e.error === 'authorization_pending') {
          setTimeout(() => pollPushValidation(resolve, reject), 3000)
        } else{
          reject(e)
        }
      }
    }

    const { form, loading, submit, fields: finalFields, validate } = form_generics.call(
      props,
      defaultFields,
      async (fieldWithValues) => {
        try{
          await http.post(window.location.pathname, fieldWithValues)
        }catch (e) {
          form.value.toggleAlert(e.error ? `errors.${e.error}` : e.message, {
            dismissible: false
          })
          throw e
        }
      }
    )

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

    }, { flush: 'post' } )
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
