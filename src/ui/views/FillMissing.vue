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
          [ validate.bind( $i18n, options) ] : undefined"
      />
    </template>

    <div class="pt-4">
      <p-btn
        color="primary"
        type="submit"
      >
        <span v-t="'fillMissing.submit'" />
      </p-btn>
    </div>
  </p-form>
</template>

<script lang="ts">
import PlusAuth from 'plusauth-js';
import { defineComponent, inject, getCurrentInstance, reactive } from 'vue';

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
    const api = inject('api') as PlusAuth

    return {
      ...reactive(props),
      resolveClientLogo,
      async submit($event: Event){
        $event.preventDefault()
        // @ts-ignore
        const valid = this.$refs.form?.validate()
        if(valid){
          const fieldsWithValues = Object.keys(props.fields)
            .reduce((prev, curr) => {
              prev[curr] = props.fields[curr].value
              return prev
            }, {})
          await api.auth.updateMissingInformation(fieldsWithValues)
        }
      },
      validate: function (options: any, value: any): any {
        if(options.validator){
          return options.validator.call(this,props.fields, value)
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
