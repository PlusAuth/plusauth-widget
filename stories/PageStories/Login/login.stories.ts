import type { Meta, StoryObj } from '@storybook/vue3';

import LoginStory from './LoginStory.vue';

type Story = StoryObj<typeof LoginStory>;

/**
 *
 */
const meta: Meta<typeof LoginStory> = {
  component: LoginStory,
  title: 'pages/Login',
  tags: ['autodocs'],
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
  }

};

export const SocialConnections = {
  args: {

  }
};
