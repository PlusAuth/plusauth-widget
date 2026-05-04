import type { Meta, StoryObj } from '@storybook/vue3-vite';

import PAlert from '../../../src/ui/components/PAlert/PAlert.vue';

type Story = StoryObj<typeof PAlert>;

/**
 * Standard Alert with solid background
 */
export const Default: Story = {
  parameters: {
    controls: { expanded: true }
  },
  args: {
    type: 'error',
    default: 'This is a status message.',
  },
  render: (args: any) => ({
    components: { PAlert },
    setup() {
      return { args };
    },
    template: `
      <PAlert v-bind="args">
        {{ args.default }}
      </PAlert>
    `,
  }),
};


const meta: Meta<typeof PAlert> = {
  title: 'Input Fields/Alert',
  component: PAlert,
  tags: ['!autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'error', 'success', 'warning'],
    },
    textColor: { control: 'color' },
    modelValue: {
      table: { disable: true }
    },
    tile: {
      table: { disable: true }
    },
    timeout: {
      table: { disable: true }
    },
    text: {
      table: { disable: true }
    }
  },
  args: {
    modelValue: true,
    text: false,
    tile: false,
    timeout: 0,
  },
};

export default meta;