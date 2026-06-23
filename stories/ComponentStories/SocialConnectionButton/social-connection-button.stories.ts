import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SocialConnectionButtonStory from './SocialConnectionButtonStory.vue';

const meta: Meta<typeof SocialConnectionButtonStory> = {
  component: SocialConnectionButtonStory,
  title: 'Components/SocialConnectionButton',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof SocialConnectionButtonStory>;

export const LoginProviders: Story = {};
