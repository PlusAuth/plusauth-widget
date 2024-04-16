<script setup lang="ts">
import type { FieldDefinition } from '../../src/ui/interfaces';

import WidgetWrapper from '../WidgetWrapper.vue';

const props = withDefaults(defineProps<FieldDefinition>(), {
  visible: true
})

const parseFunctionString = /^\s*function(\s+[a-z0-9$_]*)?\(([^)]*)\)\s*\{([\s\S]*)\}\s*$/i;

function stringToFn(s: any) {
  if (typeof s === 'string'){
    try {
      let m = s.match(parseFunctionString);
      if( m ){
        m = Function(m[2], m[3]) as any;
      }
      return m
    } catch (e) {
      return undefined
    }
  }
  return s
}
</script>

<template>
  <WidgetWrapper
    :settings="{
      modeOptions: {
        login: {
          fields: {
            username: undefined,
            email: undefined,
            password: undefined,
            'custom-text-field': {
              ...props,
              validator: stringToFn(props.validator)
            }
          }
        }
      }
    }"
  />
</template>
