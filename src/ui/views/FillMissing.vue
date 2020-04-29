<template>
  <p-form
    ref="form"
    class="text-center"
    method="post"
    :action="formAction()"
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
import { defineComponent, onMounted } from 'vue';

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

    return {
      validate: function (options: any, value: any): any {
        if(options.validator){
          return options.validator.call(this,props.fields, value)
        }else {
          return undefined
        }
      },
    }
  },
  methods: {
    resolveClientLogo,
    formAction(){
      return '/forgotPassword'
    },
    submit($event: Event){
      $event.preventDefault()
      // @ts-ignore
      const valid = this.$refs.form?.validate()
      if(valid){
        //  TODO: submit
      }
    }
  }
})
</script >

<style scoped >

</style >
