import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ResetPasswordStory from './ResetPasswordStory.vue';

const meta: Meta<typeof ResetPasswordStory> = {
  component: ResetPasswordStory,
  title: 'Pages/ResetPassword',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof ResetPasswordStory>;
const disabledControl = {
  
  table: {
    disable: true
  }
};

export const Default: Story = {
  argTypes: {
    fields: disabledControl,
    context: disabledControl
  }
};

export const CustomFields: Story = {
  args: {
    fields: {
      recovery_token: {
        type: 'text',
        order: -1,
        label: 'Recovery Token',
        placeholder: 'Enter one-time recovery token'
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};
