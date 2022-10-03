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
      <template v-if="options.visible !== 'hidden' && options.visible !== false">
        <template v-if="options.type === 'code'">
          <PCodeInput
            v-model="options.value"
            v-bind="options.attrs"
            :size="options.length"
            color="primary"
          />
          <p-message
            :value="options.errors"
            color="error"
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
            :rules="[ validate.bind( null, options, field) ]"
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
          :rules="[ validate.bind( null, options, field) ] "
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
    </template>
    <p-alert
      v-model="alert"
      :color="alertOptions.type || 'error'"
      v-bind="alertOptions.value"
    >
      <p-message :value="alertMsg" />
    </p-alert>
    <input
      type="submit"
      hidden
      style="display: none"
    >
  </p-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

import { AdditionalFields } from '../interfaces';

import { PAlertProps } from './PAlert';
import PCheckBox from './PCheckBox';
import PCodeInput from './PCodeInput';

export default defineComponent( {
  name: 'GenericForm',
  components: { PCheckBox, PCodeInput },
  props: {
    submit: {
      type: Function as () => any,
      required: true,
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
    const alert = ref<boolean>(false)
    const alertMsg = ref<string | null>(null)
    const alertOptions = reactive<Record<string, any>>({})
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
      alert,
      alertMsg,
      alertOptions,
      sortedFields,
      /**
       * @param message Message to display in alert. Pass null or undefined to hide alert.
       * @param options PAlert properties
       */
      toggleAlert(message?: string | null, options?: Partial<PAlertProps>): void {
        alert.value = false
        if(!message){
          alertMsg.value = null
          return
        }
        alertMsg.value = message
        alertOptions.value = options
        setTimeout(() => {
          alert.value = true
        })
      }
    }
  }
})
</script>

<style scoped>

</style>
