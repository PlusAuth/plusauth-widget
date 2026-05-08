import type { Meta, StoryObj } from '@storybook/vue3-vite';

import TextFieldStory from './TextFieldStory.vue';

const meta: Meta<typeof TextFieldStory> = {
  component: TextFieldStory,
  title: 'Components/TextField',
  tags: ['!autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number']
    }
  }
};

export default meta;
type Story = StoryObj<typeof TextFieldStory>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'plusauth-user'
  }
};

export const PasswordType: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password'
  }
};
