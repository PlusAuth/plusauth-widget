import type { PropType } from 'vue';
import { camelize, defineComponent, h, inject } from 'vue';

import { setColorStyle } from '../../utils';
import type { Translator } from '../../utils/translator';
import { translatorKey } from '../../utils/translator';
import PMessage from '../PMessage/PMessage';
import './PasswordStrength.css'

export default defineComponent({
  name: 'PasswordStrengthTooltip',
  props: {
    state: {
      type: Object as PropType<{ isDirty: boolean, isPristine: boolean, isFocused: boolean }>
    },
    message: { type: null, default: null },
    rules: null
  },
  setup(props) {
    const translator = inject(translatorKey) as Translator
    return {
      generatePolicyElements(result: any) {
        if (!props.rules || typeof result === 'string') {
          return h(PMessage, {
            value: result
          })
        }
        const isDirty = props.state?.isDirty
        return h(
          'div',
          {
            class: {
              'pa__messages': true,
              'pa__pw-strength': true
            }
          },
          Object.keys(props.rules).map((policy) => {
            const elemText = translator.t(
              `passwordPolicy.${camelize(policy.replace('_', '-'))}`,
              [props.rules[policy]]
            )
            return h('div', {
              style: setColorStyle( isDirty ? {
                textColor: !result || !result[policy] ? 'success' : 'error'
              } : {
                textColor: '#000000de'
              }),
              class: {
                'pa__messages__message': true,
                'pa__pw-policy': true,
              },
              key: policy, ref: 'policy'
            },
            [
              h('span', { }, isDirty ? result && result[policy] ? '✕' : '✓' : '○'),
              elemText
            ])
          })
        )

      }
    }
  },
  render() {
    return this.generatePolicyElements(this.message)
  }
})
