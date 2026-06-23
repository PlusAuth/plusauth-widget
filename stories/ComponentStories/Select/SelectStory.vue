<script setup lang="ts">
import WidgetWrapper from '../../WidgetWrapper.vue';
</script>

<template>
  <WidgetWrapper
    :context="{
      client: {
        tosUri: 'https://example.com/terms',
        policyUri: 'https://example.com/privacy'
      }
    } as any"
    :settings="{ mode: 'login' }"
  />
</template>
