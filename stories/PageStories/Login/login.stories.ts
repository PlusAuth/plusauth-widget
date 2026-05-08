import type { Meta, StoryObj } from '@storybook/vue3-vite';

import LoginStory from './LoginStory.vue';

const meta: Meta<typeof LoginStory> = {
  component: LoginStory,
  title: 'Pages/Login',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof LoginStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

export const Default: Story = {
  args: {
    fields: {}
  },
  argTypes: {
    context: disabledControl
  }
};

export const CustomFields: Story = {
  args: {
    fields: {
      terms_of_service: {
        type: 'checkbox',
        label: 'I accept the terms',
        order: 10
      },
      email: null,
      username: {
        type: 'text',
        label: 'Username',
        placeholder: 'Username here'
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};

export const SocialConnections: Story = {
  args: {
    context: {
      client: {
        social: [
          {
            name: 'google',
            provider: 'google',
            branding: {
              display_name: 'Google',
              show_in_login: true
            }
          },
          {
            name: 'github',
            provider: 'github',
            branding: {
              display_name: 'GitHub',
              show_in_login: true
            }
          }
        ]
      }
    }
  },
  argTypes: {
    fields: disabledControl
  }
};
