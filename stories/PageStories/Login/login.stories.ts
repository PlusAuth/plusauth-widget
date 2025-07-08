import type { Meta, StoryObj } from '@storybook/vue3-vite';

import LoginStory from './LoginStory.vue';

type Story = StoryObj<typeof LoginStory>;

/**
 *
 */
const meta: Meta<typeof LoginStory> = {
  component: LoginStory,
  title: 'pages/Login',
  tags: ['autodocs', '!dev'],
}

export default meta


/**
 * You can provide custom fields for your view
 */
export const CustomFields: Story = {
  args: {
    fields: {
      myCustomField: {
        label: 'MyCustomField',
        order: -1
      }
    }
  },
  parameters: {
    docs: {
    }
  }

};

export const SocialConnections = {
  args: {

  }
};
