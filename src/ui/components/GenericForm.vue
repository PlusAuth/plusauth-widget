<template>
  <p-form
    ref="formRef"
    autocomplete="off"
    @submit="submit"
  >
    <template
      v-for="(options, field) in sortedFields"
      :key="field"
    >
      <p-text-field
        v-model="options.value"
        v-bind="options.attrs"
        :error-messages="options.errors"
        :type="options.type"
        :label="options.label"
        :rules="options.validator ?
          [ validate.bind( null, options) ] : undefined"
      >
        <template
          v-if="field === 'password'"
          #append
        >
          <p-btn
            type="button"
            flat
            text-color="#000"
            tabindex="0"
            class="pa__pw-toggle-visibility"
            @click="options.type === 'password' ? options.type = 'text' : options.type =
              'password'"
          >
            <span
              v-t="options.type === 'password' ? 'login.showPassword' : 'login.hidePassword'"
            />
          </p-btn>
          <slot :name="field" />
        </template>
        <template
          v-if="$slots[field+'.message']"
          #message="message"
        >
          <slot
            :name="field+'.message'"
            v-bind="message"
          />
        </template>
      </p-text-field>
    </template>
  </p-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { AdditionalFields } from '../interfaces';

export default defineComponent( {
  name: 'GenericForm',
  props: {
    submit: {
      type: Function as () => any,
      default: () => false
    },
    validate: {
      type: Function as () => any,
      default: () => false
    },
    fields: {
      type: Object as () => AdditionalFields,
      default: () => ({})
    }
  },
  setup(props){
    const formRef = ref<any>(null)

    const sortedFields = computed(()=> {
      return Object.keys(props.fields)
        .sort((a, b) => (props.fields[a]?.order || 0) - (props.fields[b]?.order || 0))
        .reduce(function (result, key) {
          result[key] = props.fields[key];
          return result;
        }, {});
    } )

    return {
      formRef,
      sortedFields,
    }
  }
})
</script>

<style scoped>

</style>
