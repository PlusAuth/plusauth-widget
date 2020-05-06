<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <div
      v-if="context.settings.passwordResetFlow === 'newPassword'
        && context.newPassword"
    >
      <span v-t="'resetPassword.informNewPassword'" />

      <div>
        {{ context.newPassword }}
      </div>
    </div>
    <div v-else>
      <div
        v-if="actionCompleted"
        v-t="'resetPassword.successfullyReset'"
      />
      <p-form
        v-else
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
          v-t="'resetPassword.title'"
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
            <span v-t="'resetPassword.submit'" />
          </p-btn>
        </div>
      </p-form>
    </div>
  </transition>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-js';
import { defineComponent, getCurrentInstance,
  inject, reactive, ref } from 'vue';

import { useRoute } from 'vue-router';

import PBtn from '../components/PBtn';
import PForm from '../components/PForm';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'ResetPassword',
  components: { PBtn, PForm },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
        password: {
          type: 'password',
          label: 'resetPassword.newPassword',
          validator(fields, value){
            if(!value){
              return this.t('resetPassword.errors.newPasswordRequired')
            }
            return true
          }
        },
        rePassword: {
          type: 'password',
          label: 'resetPassword.rePassword',
          validator(fields, value){
            if(!value){
              return this.t('resetPassword.errors.rePasswordRequired')
            }
            if(fields.password.value !== value){
              return this.t('resetPassword.errors.passwordsNotMatch')
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
    const codeForm = ref<InstanceType<typeof PForm>>(null as any)
    const loading = ref(false)
    const actionCompleted = ref(false)
    const route = useRoute()
    const code = ref(null)
    return {
      code,
      ...reactive(props),
      form,
      codeForm,
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
            await api.auth.resetPassword(
              props.fields.password.value as string,
              route.params.token as string
            )
            actionCompleted.value= true
          }catch (e) {
            console.error(e)
            props.fields.password['errors'] = e.error;
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
