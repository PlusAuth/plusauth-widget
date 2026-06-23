import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ButtonStory from './ButtonStory.vue';

const meta: Meta<typeof ButtonStory> = {
  component: ButtonStory,
  title: 'Components/Button',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof ButtonStory>;

export const Default: Story = {};
