<template>
  <p-form
    ref="formRef"
    autocomplete="off"
    @submit="submit"
  >
    <template
      v-for="(field) in sortedFields"
      :key="field"
    >
      <template v-if="fields[field].visible !== 'hidden' && fields[field].visible !== false">
        <template v-if="fields[field].type === 'code'">
          <PCodeInput
            v-model="fields[field].value"
            v-bind="fields[field].attrs"
            :label="fields[field].label"
            :size="fields[field].length"
            color="primary"
          />
          <p-message
            :value="fields[field].errors"
            color="error"
            class="pa__mb-4"
          />
        </template>
        <template v-else-if="fields[field].type === 'checkbox'">
          <PCheckBox
            v-model="fields[field].value"
            v-bind="fields[field].attrs"
            :name="field"
            :error-messages="fields[field].errors"
            :type="fields[field].type"
            :label="fields[field].label"
            :rules="[ validate.bind( null, fields[field], field) ]"
          />
        </template>
        <p-text-field
          v-else
          v-model="fields[field].value"
          v-bind="fields[field].attrs"
          :error-messages="fields[field].errors"
          :name="field"
          :type="fields[field].type"
          :label="fields[field].label"
          :placeholder="fields[field].placeholder"
          :rules="[ validate.bind( null, fields[field], field) ] "
        >
          <template
            v-for="(opts, name) in fields[field].slots || {}"
            :key="name"
            #[name]
          >
            <component
              :is="opts.element"
              v-bind="{...opts.props, innerHtml: undefined}"
              v-html="opts.props.innerHtml"
            />
          </template>

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
              @click="fields[field].type === 'password' ?
                fields[field].type = 'text' : fields[field].type = 'password'"
            >
              <span
                v-t="fields[field].type === 'password' ? 'common.show' : 'common.hide'"
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
    <slot />
    <p-alert
      v-model="alert"
      style="margin-top: 12px"
      :color="alertOptions.type || 'error'"
      v-bind="alertOptions.value"
    >
      <p-message
        v-if="alertMsg"
        :value="alertMsg"
      />
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

import type { FieldDefinition, ITranslatePath } from '../interfaces';


import type { PAlertProps } from './PAlert/PAlert';
import PBtn from './PBtn/PBtn.vue';
import PCheckBox from './PCheckBox/PCheckBox.vue';
import PCodeInput from './PCodeInput/PCodeInput';
import PForm from './PForm.vue';
import PMessage from './PMessage/PMessage.ts';
import PTextField from './PTextField/PTextField.vue';

export default defineComponent( {
  name: 'GenericForm',
  components: { PCheckBox, PCodeInput, PForm, PTextField, PMessage, PBtn },
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
      type: Object as () => Record<string, FieldDefinition>,
      default: () => ({})
    }
  },
  setup(props){
    const formRef = ref<any>(null)
    const alert = ref<boolean>(false)
    const alertMsg = ref<ITranslatePath | null>(null)
    const alertOptions = reactive<Record<string, any>>({})
    const sortedFields = computed(()=> {
      return Object.keys(props.fields)
        .sort((a, b) => (props.fields[a]?.order || 0) - (props.fields[b]?.order || 0))
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
      toggleAlert(message?: ITranslatePath, options?: Partial<PAlertProps>): void {
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
