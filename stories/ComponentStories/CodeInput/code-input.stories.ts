import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CodeInputStory from './CodeInputStory.vue';

const meta: Meta<typeof CodeInputStory> = {
  component: CodeInputStory,
  title: 'Components/CodeInput',
  tags: ['!autodocs'],
  argTypes: {
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    size: {
      control: {
        type: 'number',
        min: 4,
        max: 8,
        step: 1
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof CodeInputStory>;

const disabledControl = {
  control: false,
  table: {
    disable: true
  }
};

export const Default: Story = {};

export const FourDigitCode: Story = {
  args: {
    size: 4
  }
};

export const PreFilledCode: Story = {
  args: {
    modelValue: '123456'
  },
  argTypes: {
    size: disabledControl
  }
};
