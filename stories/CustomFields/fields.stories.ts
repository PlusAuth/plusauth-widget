import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { FieldArgTypes } from '../helpers/fieldArgType';

import CustomField from './CustomField.vue';

type Story = StoryObj<typeof CustomField>;


/**
 * You can provide custom fields for your view
 */
export const TextField: Story = {
  parameters: {
    controls: {
      expanded: true,
      exclude: ['length']
    }
  },
  args: {
    type: 'text',
    visible: true,
  },
  argTypes: {
    ...FieldArgTypes,
    type: {
      control: false,
      table: {
        type: { summary: '"text"' }
      }
    },
  }
};

/**
 * You can provide custom fields for your view
 */
export const Code: Story = {
  parameters: {
    controls: {
      expanded: true,
    }
  },
  args: {
    type: 'code',
    label: 'Enter Code',
    visible: true,
  },
  argTypes: {
    ...FieldArgTypes,
    type: {
      control: false,
      table: {
        type: { summary: '"code"' }
      }
    },
  }
};
/**
 * You can provide custom fields for your view
 */
export const CheckBox: Story = {
  parameters: {
    controls: {
      expanded: true,
    }
  },
  args: {
    type: 'checkbox',
    label: 'My custom checkbox',
    visible: true,
  },
  argTypes: {
    ...FieldArgTypes,
    type: {
      control: false,
      table: {
        type: { summary: '"checkbox"' }
      }
    },
  }
};


/**
 *
 */
const meta: Meta<typeof CustomField> = {
  component: CustomField,
  title: 'Custom Fields',
  tags: ['!autodocs']
}


export default meta
