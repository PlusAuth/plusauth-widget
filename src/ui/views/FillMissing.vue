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
    <div
      v-t="'fillMissing.title'"
      class="pa__form-title"
    />
    <template v-for="(options, field) in fields">
      <p-text-field
        :key="field"
        v-model="options.value"
        v-bind="options.attrs"
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
      >
        <span v-t="'fillMissing.submit'" />
      </p-btn>
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-web';
import { defineComponent, getCurrentInstance,
  inject, reactive, ref } from 'vue';

import { PForm } from '../components';
import { AdditionalFields } from '../interfaces';
import { resolveClientLogo } from '../utils';


export default defineComponent({
  name: 'FillMissing',
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
      })
    },
  },
  watch: {
    finalFields: {
      handler(this: any){
        const contextFields = this['context']?.details?.fields
        if(contextFields){
          if(Array.isArray(contextFields)){
            contextFields.forEach(field => {
              this.fields[field] = {
                value: null,
                type: 'text',
                label: `fillMissing.${field}`,
                validator(fields: any, value: any){
                  if(!value){
                    return this.t(`fillMissing.errors.${field}Required`)
                  }
                  return true
                }
              }
            })
          }
        }
      }, immediate: true
    }
  },
  setup(props){
    const vm = getCurrentInstance()
    const api = inject('api') as PlusAuth
    const loading = ref(false)
    const form = ref<any>(null)

    return {
      ...reactive(props),
      resolveClientLogo,
      form,
      loading,
      async submit($event: Event): Promise<boolean> {
        $event.preventDefault()

        loading.value = true

        const valid = form.value?.validate()
        if(valid){
          form.value?.resetValidation()
          const fieldsWithValues = Object.keys(props.fields)
            .reduce((prev, curr) => {
              prev[curr] = props.fields[curr].value
              return prev
            }, {})
          try{
            await api.auth.updateMissingInformation(fieldsWithValues)
          }catch (e) {
            if(e.field){
              props.fields[e.field].errors = e.error
            }else{
              // TODO: display error somewhere
              console.error(e)
            }
          }finally {
            loading.value = false
          }
          return false
        }else{
          loading.value = false
          return false
        }
      },
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
    }
  },
})
</script >

<style scoped >

</style >
