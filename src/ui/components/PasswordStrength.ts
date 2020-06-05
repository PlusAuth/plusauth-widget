import { defineComponent, h, inject } from 'vue';

import { Translator, translatorKey } from '../utils/translator';

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
        return Object.keys(context.passwordPolicy).map(( policy ) => {
          const elemText = translator.t(
            `passwordPolicy.${ policy }`,
            [context.passwordPolicy[policy]]
          )
          return h('div', {
            class: {
              'pw-policy': true,
              'success--text': !result || !result[policy]
            },
            key: policy, ref: 'policy'
          },
          [
            h('span', {
            },result && result[policy] ? '✕' : '✓'),
            elemText
          ])
        })
      }
    }
  },
  render(){
    return h('div', {
      class: {
        'pa-pw-strength': true
      }
    }, this.generatePolicyElements(this.message))
  }
})
