import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MessageStory from './MessageStory.vue';

const meta: Meta<typeof MessageStory> = {
  component: MessageStory,
  title: 'Components/Message',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof MessageStory>;

export const Default: Story = {};
