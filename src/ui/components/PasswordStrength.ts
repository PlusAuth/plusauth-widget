import { defineComponent, h, inject } from 'vue';

import { Translator, translatorKey } from '../utils/translator';

import PMessage from './PMessage';

export default defineComponent({
  name: 'PasswordStrengthTooltip',
  props: {
    message: { type: null, default: null },
  },
  setup(){
    const translator = inject(translatorKey) as Translator
    const context = inject('context') as any
    return {
      generatePolicyElements(result: any) {
        if(!context.passwordPolicy || typeof result === 'string'){
          return h(PMessage, {
            class: 'pa__input-details',
            value: result
          })
        }
        return h('div', {
          class: {
            'pa__pw-strength': true
          }
        }, Object.keys(context.passwordPolicy).map(( policy ) => {
          const elemText = translator.t(
            `passwordPolicy.${ policy }`,
            [context.passwordPolicy[policy]]
          )
          return h('div', {
            class: {
              'pa__pw-policy': true,
              'pa__success--text': !result || !result[policy]
            },
            key: policy, ref: 'policy'
          },
          [
            h('span', {
            },result && result[policy] ? '✕' : '✓'),
            elemText
          ])
        })
        )

      }
    }
  },
  render(){
    return this.generatePolicyElements(this.message)
  }
})
