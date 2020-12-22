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
      <template v-if="options.type === 'code'">
        <PCodeInput
          v-model="options.value"
          v-bind="options.attrs"
          :size="options.length"
          color="pa__primary"
        />
        <p-message
          :value="options.errors"
          color="pa__error"
          class="pa__mb-4"
        />
      </template>
      <template v-else-if="options.type === 'checkbox'">
        <PCheckBox
          v-model="options.value"
          v-bind="options.attrs"
          :name="field"
          :error-messages="options.errors"
          :type="options.type"
          :label="options.label"
          :rules="options.validator ?
            [ validate.bind( null, options, field) ] : undefined"
        />
      </template>
      <p-text-field
        v-else
        v-model="options.value"
        v-bind="options.attrs"
        :error-messages="options.errors"
        :name="field"
        :type="options.type"
        :label="options.label"
        :rules="options.validator ?
          [ validate.bind( null, options, field) ] : undefined"
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
              v-t="options.type === 'password' ? 'common.show' : 'common.hide'"
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
    <input
      type="submit"
      hidden
      style="display: none"
    >
  </p-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { AdditionalFields } from '../interfaces';

import PCheckBox from './PCheckBox';
import PCodeInput from './PCodeInput';

export default defineComponent( {
  name: 'GenericForm',
  components: { PCheckBox, PCodeInput },
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
