import type { Meta, StoryObj } from '@storybook/vue3';

import { PButton } from '../../../src/ui/components';


const meta: Meta<typeof PButton> = {
  title: 'Input Fields/Button',
  component: PButton,
  tags: ['!autodocs'],
  argTypes: {
    color: { control: 'text' },
    textColor: { control: 'text' },
  },
  args: {
    block: false,
    disabled: false,
    flat: false,
    loading: false,
    color: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof PButton>;

export const Default: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args };
    },
    template: '<PButton v-bind="args">Button Label</PButton>',
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args };
    },
    template: '<PButton v-bind="args">Button Label</PButton>',
  }),
};

export const Block: Story = {
  args: {
    block: true,
  },
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args };
    },
    template: '<PButton v-bind="args">Full Width Button</PButton>',
  }),
};