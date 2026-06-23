<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';
</script>

<template>
  <WidgetWrapper
    :settings="{
      modeOptions: {
        login: {
          fields: {
            email: undefined,
            password: undefined,
            pw_demo: {
              type: 'text',
              label: 'Password',
              slots: {
                message: {
                  element: 'PasswordStrength',
                  props: {
                    state: {
                      isDirty: true,
                      isPristine: false,
                      isFocused: true
                    },
                    rules: {
                      min: 8,
                      number: 1,
                      upper_case: 1
                    },
                    message: {}
                  }
                }
              }
            }
          }
        }
      }
    }"
  />
</template>
