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
      <span v-t="'register.signUp'" />
    </div>
    <template v-for="(options, field) in fields">
      <p-text-field
        :key="field"
        v-model="options.value"
        v-bind="options.attrs"
        :error-messages="options.errors"
        :type="options.type"
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
        <span v-t="'register.signUp'" />
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
      class="text-center txt1 pt-4 pb-2"
    >
      <span
        v-t="'register.haveAccount'"
        class="pr-2"
      />
      <a
        v-t="'login.signIn'"
        href="/signin"
        @click.stop
      />
    </div>
    <template v-if="features.forgotPassword">
      <div class="text-center subtitle-2">
        <a
          v-t="'login.forgotPassword'"
          href="/signin/recovery"
        />
      </div>
    </template>
  </p-form>
</template>

<script lang="ts" >
import PlusAuth from 'plusauth-js';
import { defineComponent, getCurrentInstance,
  inject, reactive, ref } from 'vue';

import { PForm } from '../components';
import SocialConnectionButton from '../components/SocialConnectionButton';
import { AdditionalFields, SocialConnections } from '../interfaces';
import { resolveClientLogo } from '../utils';


export default defineComponent({
  name: 'Register',
  components: { SocialConnectionButton },
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        forgotPassword: true,
      })
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: (): AdditionalFields => ({
        username: {
          attrs: {
            autocomplete: 'username'
          },
          type: 'text',
          label: 'register.username',
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
          attrs: {
            autocomplete: 'new-password'
          },
          validator(fields, value){
            if(!value){
              return this.t('register.errors.passwordRequired')
            }
            return true
          }
        },
        rePassword: {
          type: 'password',
          label: 'register.rePassword',
          attrs: {
            autocomplete: 'new-password'
          },
          validator(fields, value){
            if(!value){
              return this.t('register.errors.rePasswordRequired')
            }
            if(fields.password.value !== value){
              return this.t('register.errors.passwordsNotMatch')
            }
            return true
          }
        }
      })
    },
    socialConnections: {
      type: Array as () => SocialConnections[],
      default: (): SocialConnections[] => ['google', 'facebook']
    }
  },
  setup(props){
    const vm = getCurrentInstance()
    const api = inject('api') as PlusAuth
    const form = ref<InstanceType<typeof PForm>>(null as any)
    const loading = ref(false)

    return {
      ...reactive(props),
      loading,
      resolveClientLogo,
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
            await api.auth.signUp(
              Object.keys(props.fields).reduce( (prev: any, curr: string) => {
                prev[curr] = props.fields[curr].value
                return prev
              }, {})
            )
          }catch (e) {
            switch (e.error) {
              case 'already_exists':
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
    }
  }
})
</script >

<style scoped >

</style >
