import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AlertStory from './AlertStory.vue';

const meta: Meta<typeof AlertStory> = {
  component: AlertStory,
  title: 'Components/Alert',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof AlertStory>;

export const TriggerOnSubmit: Story = {};
