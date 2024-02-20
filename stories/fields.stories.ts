/* eslint-disable max-len */
import type { Meta, StoryObj } from '@storybook/vue3';

import LoginStory from './CustomFields/CustomTextField.vue';

type Story = StoryObj<typeof LoginStory>;
/**
 * ASDasd asdas dasd **asdasdsad**
 */
const meta: Meta<typeof LoginStory> = {
  component: LoginStory,
  title: 'Custom Fields',
  tags: [],
  parameters: {
    controls: {
    }
  }
}


export default meta

/**
 * You can provide custom fields for your view
 */
export const TextField: Story = {
  parameters: {
    controls: {
      expanded: true,
      exclude: ['type', 'length']
    }
  },
  args: {
    type: 'text',
    visible: true,
  },
  argTypes: {
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
        type: { summary: 'tel | email | string' }
      }
    },
    errors: {
      table: {
        type: {
          summary: 'string | string[] | { path: string, args?: Record<string, any>, locale?: string } | null'
        }
      }
    }
  }
};

export const Error = {
};
