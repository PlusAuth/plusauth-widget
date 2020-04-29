<template>
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
    <div class="pa__form-title">
      <span v-t="'login.signIn'" />
    </div>
    <template v-for="(options, field) in fields">
      <p-text-field
        :key="field"
        v-model="options.value"
        v-bind="options.attrs"
        :type="options.type"
        :label="options.label"
        :error-messages="options.errors"
        :rules="options.validator ?
          [ validate.bind( $i18n, options) ] : undefined"
      />
    </template>

    <div class="pt-4">
      <p-btn
        color="primary"
        type="submit"
        :loading="loading"
        block
      >
        <span v-t="'login.signIn'" />
      </p-btn>
    </div>

    <template v-if="features.socialConnections">
      <div class="text-center">
        <span v-t="'login.signInWith'" />
      </div>
      <div class="row justify-center">
        <template v-for="connection in socialConnections">
          <a
            :key="connection"
            class="pa__btn pa__btn--fab"
            :href="'/social?provider=' + connection"
          >
            <div class="pa__btn__content">
              <i
                class="fa fa-2x"
                :class="'fa-'+ connection"
              />
            </div>
          </a>
        </template>
      </div>
    </template>

    <div
      v-if="features.signUp"
      class="text-center txt1 pt-4 pb-2"
    >
      <span v-t="'login.noAccount'" />
      <a
        v-t="'login.signUp'"
        href="/signup"
        @click.stop
      />
    </div>
    <div class="text-center subtitle-2">
      <a
        v-t="'login.forgotPassword'"
        href="/signin/recovery"
      />
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-js';
import { defineComponent, reactive, ref, inject } from 'vue';

import { PForm } from '../components';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'Login',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    socialConnections: {
      type: Array as () => any[],
      default: () => ['google', 'facebook']
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
        username: {
          type: 'text',
          label: 'register.username',
          errors: [],
          validator(fields, value){
            if(!value){
              return this.t('register.errors.usernameRequired')
            }
            return true
          }
        },
        password: {
          type: 'password',
          label: 'register.password',
          errors: [],
          validator(fields, value){
            if(!value){
              return this.t('register.errors.passwordRequired')
            }
            return true
          }
        },
      })
    },
  },
  setup(props){
    const api = inject('api') as PlusAuth
    const form = ref<InstanceType<typeof PForm>>(null as any)
    const passwordVisible = ref(false)
    const loading = ref(false)

    return {
      ...reactive(props),
      form,
      loading,
      passwordVisible,
      validate: function (options: any, value: any) {
        if(options.validator){
          return options.validator.call(this, props.fields, value)
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
            await api.auth.signIn(
              props.fields.username.value as string,
              props.fields.password.value as string
            )
          }catch (e) {
            switch (e.error) {
              case 'user_not_found':
                props.fields.username['errors'] = e.error;
                break;
              case 'invalid_credentials':
                props.fields.password['errors'] = e.error;
                break;
              case 'email_not_verified':
                // TODO: email not verified
                break;
              default:
                props.fields.password['errors'] = e.error
            }
          }finally {
            loading.value = false
          }
          return false
        }else{
          loading.value = false
        }

      },
      resolveClientLogo
    }

  }
})
</script >

<style scoped >

</style >
