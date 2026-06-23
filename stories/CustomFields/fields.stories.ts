import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { FieldArgTypes } from '../helpers/fieldArgType';

import CustomField from './CustomField.vue';

const meta: Meta<typeof CustomField> = {
  component: CustomField,
  title: 'Custom Fields',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof CustomField>;

const disabledControl = {
  table: {
    disable: true
  }
};

const baseFieldArgTypes = {
  ...FieldArgTypes
};

export const TextField: Story = {
  parameters: {
    controls: {
      expanded: true
    }
  },
  args: {
    type: 'text',
    label: 'Username',
    visible: true
  },
  argTypes: {
    ...baseFieldArgTypes,
    type: {
      ...disabledControl,
      table: {
        type: { summary: '"text"' }
      }
    },
    length: disabledControl
  }
};

export const Code: Story = {
  parameters: {
    controls: {
      expanded: true
    }
  },
  args: {
    type: 'code',
    label: 'Enter Code',
    visible: true
  },
  argTypes: {
    ...baseFieldArgTypes,
    type: {
      ...disabledControl,
      table: {
        type: { summary: '"code"' }
      }
    },
    format: disabledControl
  }
};

export const CheckBox: Story = {
  parameters: {
    controls: {
      expanded: true
    }
  },
  args: {
    type: 'checkbox',
    label: 'My custom checkbox',
    visible: true
  },
  argTypes: {
    ...baseFieldArgTypes,
    type: {
      ...disabledControl,
      table: {
        type: { summary: '"checkbox"' }
      }
    },
    length: disabledControl,
    format: disabledControl
  }
};
