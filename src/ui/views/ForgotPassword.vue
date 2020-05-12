<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div v-if="!actionCompleted">
      <p-form
        ref="form"
        class="text-center"
        autocomplete="off"
        @submit="submit"
      >
        <img
          style="max-height: 150px"
          class="logo"
          alt="Logo"
          :src="resolveClientLogo(context.client)"
        >
        <div
          v-t="'forgotPassword.title'"
          class="pa__form-title"
        />
        <template v-for="(options, field) in fields">
          <p-text-field
            :key="field"
            v-model="options.value"
            v-bind="options.attrs"
            :type="options.type"
            :error-messages="options.errors"
            :label="options.label"
            :rules="options.validator ?
              [ validate.bind( null, options) ] : undefined"
          />
        </template>

        <div class="pt-4">
          <p-btn
            color="primary"
            type="submit"
            :loading="loading"
            block
          >
            <span v-t="'forgotPassword.submit'" />
          </p-btn>
        </div>
      </p-form>
    </div>
    <div v-else>
      <div class="row ">
        <div class="col col-12 align-center text-center">
          <img
            src="/images/icons/plane.svg"
            style="width: 128px; "
            alt="Mail Confirmation"
          >
        </div>
        <div
          v-t="'forgotPassword.emailSent'"
          class="col col-12 text-center"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-web';
import { defineComponent, getCurrentInstance,
  inject, reactive, ref } from 'vue';

import { PForm } from '../components';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'ForgotPassword',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
        email: {
          type: 'email',
          label: 'forgotPassword.email',
          validator(fields, value){
            if(!value){
              return this.t('forgotPassword.errors.emailRequired')
            }
            return true
          }
        }
      })
    },
  },
  setup(props){
    const vm = getCurrentInstance()
    const api = inject('api') as PlusAuth
    const form = ref<InstanceType<typeof PForm>>(null as any)
    const loading = ref(false)
    const actionCompleted = ref(false)

    return {
      ...reactive(props),
      form,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate: function (options: any, value: any): any {
        if(options.validator){
          return options.validator.call(
            vm?.appContext.config.globalProperties.$i18n,
            props.fields,
            value
          )
        }else {
          return undefined
        }
      },
      async submit($event: Event){
        $event.preventDefault()

        Object.values(props.fields).forEach(field => {
          field.errors = null
        })
        loading.value = true
        const valid = form.value?.validate()

        if(valid){
          form.value?.resetValidation()
          try{
            await api.auth.requestResetPassword(
              props.fields.email.value as string
            )
            actionCompleted.value= true
          }catch (e) {
            console.error(e)
            switch (e.error) {
              case 'user_not_found':
                props.fields.email['errors'] = e.error;
                break;
              case 'invalid_credentials':
                props.fields.email['errors'] = e.error;
                break;
              case 'email_not_verified':
                // TODO: email not verified
                break;
              default:
                props.fields.email['errors'] = e.error
            }
          }finally {
            loading.value = false
          }
          return false
        }else{
          loading.value = false
        }

      },

    }
  },
})
</script >

<style scoped >

</style >
