import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { PCheckBox } from '../../../src/ui/components';

type Story = StoryObj<typeof PCheckBox>;

/**
 * Default Checkbox state with a label
 */
export const Default: Story = {
  parameters: {
    controls: {
      expanded: true,
    }
  },
  args: {
    label: 'Standard Checkbox',
    modelValue: null,
  },
  render: (args: any) => ({
    components: { PCheckBox },
    setup() {
      return { args };
    },
    template: `
      <PCheckBox 
        v-bind="args" 
        @update:modelValue="(val) => args.modelValue = val"
      />
    `,
  }),
};

/**
 * Checkbox showing validation error messages
 */
export const WithError: Story = {
  parameters: {
    controls: {
      expanded: true,
    }
  },
  args: {
    label: 'Required Field',
    errorMessages: ['This field is required'],
    modelValue: false,
  },
  render: (args: any) => ({
    components: { PCheckBox },
    setup() {
      return { args };
    },
    template: `
      <PCheckBox 
        v-bind="args" 
        @update:modelValue="(val) => args.modelValue = val"
      />
    `,
  }),
};

/**
 * Checkbox using custom true/false values instead of booleans
 */
export const CustomValues: Story = {
  args: {
    label: 'Custom Value Checkbox',
    trueValue: 'YES',
    falseValue: 'NO',
    modelValue: 'NO',
    hint: 'Returns "YES" or "NO"',
    persistentHint: true
  },
  render: (args: any) => ({
    components: { PCheckBox },
    setup() {
      return { args };
    },
    template: `
      <PCheckBox 
        v-bind="args" 
        @update:modelValue="(val) => args.modelValue = val"
      />
    `,
  }),
};

const meta: Meta<typeof PCheckBox> = {
  component: PCheckBox,
  title: 'Input Fields/CheckBox',
  tags: ['!autodocs']
};

export default meta;