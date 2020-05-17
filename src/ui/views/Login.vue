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
          [ validate.bind(null, options ) ] : undefined"
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

    <template
      v-if="features.socialConnections && context.client
        && context.client.social
        && context.client.social.length"
    >
      <div class="text-center pt-4">
        <span v-t="'login.signInWith'" />
      </div>
      <div class="row justify-center">
        <SocialConnectionButton
          v-for="connection in context.client.social"
          :key="connection"
          :type="connection"
          :href="'/social?provider=' + connection"
        />
      </div>
    </template>

    <div
      v-if="features.signUp"
      class="text-center txt1 pt-4 pb-2"
    >
      <span
        v-t="'login.noAccount'"
        class="pr-2"
      />
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
import PlusAuth from 'plusauth-web';
import { defineComponent, reactive,
  ref, inject, getCurrentInstance } from 'vue';

import { PForm } from '../components';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';

export default defineComponent({
  name: 'Login',
  components: { SocialConnectionButton },
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
      default: () => []
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
        username: {
          type: 'text',
          label: 'login.username',
          errors: [],
          validator: function (fields, value){
            if(!value){
              return this.t('login.errors.usernameRequired')
            }
            return true
          }
        },
        password: {
          type: 'password',
          label: 'login.password',
          errors: [],
          validator: function (fields, value){
            if(!value){
              return this.t('login.errors.passwordRequired')
            }
            return true
          }
        },
      })
    },
  },
  setup(props){
    const vm = getCurrentInstance()
    const api = inject('api') as PlusAuth
    const form = ref<any>(null)
    const passwordVisible = ref(false)
    const loading = ref(false)

    return {
      ...reactive(props),
      form,
      loading,
      passwordVisible,
      validate: function (options: any, value: any) {
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
            await api.auth.signIn(
              Object.keys(props.fields).reduce( (prev: any, curr: string ) => {
                prev[curr] = props.fields[curr].value
                return prev;
              }, {})
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
