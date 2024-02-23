import type { ArgTypes } from '@storybook/vue3';
import type { ComponentOptions } from 'vue';

export const FieldArgTypes: Partial<ArgTypes<ComponentOptions>> = {
  type: {
    type: 'string',
    table: {
      type: { summary: '"text" | "checkbox" | "code" | string' }
    }
  },
  validator: {
    type: 'string',
    table: {
      type: { summary: 'function' }
    }
  },
  attrs: {
    type: {
      name: 'object',
      value: {}
    },
    table: {
      type: { summary: 'object' }
    }
  },
  visible: {
    type: 'boolean',
    table: {
      type: { summary: 'boolean | hidden' }
    }
  },
  value: {
    table: {
      type: { summary: 'string | number | boolean' }
    }
  },
  label: {
    type: 'string'
  },
  format: {
    type: 'string',
    table: {
      type: { summary: '"tel" | "email" | string' }
    }
  },
  errors: {
    table: {
      type: {
        // eslint-disable-next-line max-len
        summary: 'string | string[] | { path: string, args?: Record<string, any>, locale?: string } | null'
      }
    }
  }
}
