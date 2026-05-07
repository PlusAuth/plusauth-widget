import type { Meta, StoryObj } from '@storybook/vue3-vite';

import RegisterStory from './RegisterStory.vue';

const meta: Meta<typeof RegisterStory> = {
  component: RegisterStory,
  title: 'Pages/Register',
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj<typeof RegisterStory>;

export const Default: Story = {
  args: {
    fields: {}
  }
};

export const CustomSignUpFields: Story = {
  args: {
    fields: {
      first_name: {
        type: 'text',
        label: 'First Name',
        order: -2
      },
      last_name: {
        type: 'text',
        label: 'Last Name',
        order: -1
      },
    }
  }
};