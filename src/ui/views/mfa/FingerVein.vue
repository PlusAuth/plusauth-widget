<template>
  <!-- eslint-disable max-len -->
  <div style="position: relative">
    <template v-if="deviceOk && (!context.details.fv_template || context.details.fv_template.length === 0)">
      <div class="pa__widget-info-section">
        <h2 v-t="'mfa.fv.enroll'" />
      </div>
      <div
        class="pa__hands_container"
      >
        <Hand
          :class="{'disabled' : loading}"
          :selected="enrolledFingers.left"
          @select="onFingerSelect($event, 'left')"
        />
        <Hand
          :class="{'disabled' : loading}"
          style="transform: rotateY(180deg)"
          :selected="enrolledFingers.right"
          @select="onFingerSelect($event,'right')"
        />
      </div>
    </template>
    <template v-else-if="!deviceOk">
      <div
        v-t="{ path: 'mfa.fv.checkDevice'}"
        style="margin-bottom: 8px"
        class="pa__subtitle-2 pa__text-left"
      />
    </template>
    <template v-else>
      <div
        v-t="{ path: 'mfa.fv.verify'}"
        class="pa__subtitle-2 pa__text-left"
      />
    </template>
    <GenericForm
      ref="form"
      style="padding-top: 24px"
      :fields="finalFields"
      :validate="validate"
      :submit="submit"
    />

    <div class="pa__widget-content-actions">
      <p-btn
        v-if="deviceOk"
        block
        color="primary"
        :loading="loading"
        @click="submit"
      >
        <span v-t="context.details.fv_template?.length > 0 ? 'common.verify' : 'common.submit'" />
      </p-btn>
    </div>
    <div
      v-if="loading"
      style="position:absolute; top: 0; bottom: 0; right: 0; display: flex; align-items: center; flex-direction: column; left: 0; justify-content: center; background: white; opacity: 1;"
    >
      <p-loading
        color="primary"
        indeterminate
      />
      <div
        v-if="loadingMsg"
        v-t="loadingMsg"
        style="margin-top: 12px; font-size: 0.9em"
      />
    </div>
  </div>

  <div
    v-if="context.details.challenges.length > 1"
    class="pa__widget-helpers-section"
  >
    <a
      v-t="'mfa.tryAnotherWay'"
      href="/signin/challenge"
    />
  </div>
</template>

<script lang="ts">
import { PlusAuthWeb, MFACodeType } from '@plusauth/web';
import { defineComponent, inject, onMounted, reactive, ref } from 'vue';

import GenericForm from '../../components/GenericForm.vue';
import Hand from '../../components/Hand.vue';
import PLoading from '../../components/PLoading';
import { CustomizableFormProps } from '../../mixins/customizable_form';
import form_generics from '../../utils/form_generics';
import { H1FingerVeinService } from '../../utils/fv_helper';

export default defineComponent({
  name: 'FingerVein',
  components: { PLoading, Hand, GenericForm },
  props: {
    ...CustomizableFormProps
  },
  setup(props){
    const api = inject('api') as PlusAuthWeb
    const context = inject('context') as any
    const loadingMsg = ref<string | null>(null as any)
    const deviceOk = ref<boolean>(false)
    const selectedFinger = ref<number>(1 as any)
    const error = ref<string>(null as any)
    const templates = reactive({})

    const enrolledFingers = reactive({
      left: [] as number[],
      right: [] as number[],
    })
    const fv = new H1FingerVeinService()

    const { form, loading, fields: finalFields, validate } = form_generics.call(props)
    loading.value= true
    onMounted(async () => {
      try{
        loadingMsg.value = 'mfa.fv.checkingDevice'
        await fv.ping()
        const status = await fv.deviceStatus()
        if(status.ReturnCode !== '0'){
          throw `0x${status.ReturnCode}`
        }
        deviceOk.value = true;
      }catch (e) {
        deviceOk.value = false;
        form.value.toggleAlert(`errors.fv.${e.error || e.retCode || e}`, {
          dismissible: false
        })
      }finally {
        loading.value = false
      }
    })
    return {
      finalFields,
      validate,
      loadingMsg,
      selectedFinger,
      deviceOk,
      context,
      error,
      templates,
      enrolledFingers,
      form,
      loading,
      async onFingerSelect(ind: number, hand: 'left' | 'right'){
        loadingMsg.value = 'mfa.fv.enrollmentInProgress'
        loading.value= true
        let h1Index = ind
        if(hand === 'right'){
          h1Index += 3
        }
        try{
          const resp = await fv.enroll(h1Index)
          enrolledFingers[hand].push(ind)
          templates[h1Index] = resp.template
          form.value.toggleAlert('Finger Enrolled', {
            dismissible: false,
            timeout: 3000,
            type: 'success'
          })
        }catch (e){
          form.value.toggleAlert(`errors.fv.${e.error || e.retCode || e}`, {
            dismissible: false
          })
        }finally {
          loadingMsg.value = null
          loading.value= false
        }

      },

      async submit(){
        loading.value = true
        loadingMsg.value = null
        try{
          if (!context.details.fv_template || context.details.fv_template.length === 0) {
            if (!templates || Object.keys(templates).length === 0) {
              form.value.toggleAlert('errors.fv.enrollRequired', {
                dismissible: false
              })
            } else {
              loadingMsg.value = 'mfa.fv.saving'
              await api.auth.updateMissingInformation({
                templates
              })
            }
          }else {
            loadingMsg.value = 'mfa.fv.verifyInProgress'
            const resp = await fv.verify(1, context.details.fv_template)
            await api.mfa.validateCode(resp, MFACodeType.FINGER_VEIN)
          }
        }catch (e) {
          if(e.retCode){
            form.value.toggleAlert(`errors.fv.${e.retCode}`, {
              dismissible: false
            })
          } else if (e.error) {
            form.value.toggleAlert(`errors.${e.error}`, {
              dismissible: false
            })
          }
          throw e
        }finally {
          loading.value = false
        }
      }
    }
  }
})
</script>

<style  lang="scss">
.hands_container{
  padding: 12px 0;
  display: flex;

  .st0 {
    fill: transparent;
    z-index: 1;
    cursor: pointer;

    &:hover {
      & + .finger {
        fill: #0D47A1;
      }
    }
  }

  .finger {
    &:hover {
      fill: #0D47A1;
      cursor: pointer;
    }
  }

  .hand:first-of-type {
    margin-right: 14px;
  }

  .hand {
    path {
      fill: #262626;
    }
    .selected{
      pointer-events: none;
      .finger{
        fill: #6bbb40;
      }
    }
    .thumb_container, .little_container, .palm {
      pointer-events: none;
      path {
        fill: gray;
        opacity: 0.3;
      }
    }
  }
}
</style>
