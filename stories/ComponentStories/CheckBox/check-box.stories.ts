import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CheckBoxStory from './CheckBoxStory.vue';

const meta: Meta<typeof CheckBoxStory> = {
  component: CheckBoxStory,
  title: 'Components/CheckBox',
  tags: ['!autodocs'],
  argTypes: {
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof CheckBoxStory>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    modelValue: true
  }
};
