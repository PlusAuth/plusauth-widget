import type { Meta, StoryObj } from '@storybook/vue3-vite';

import PasswordStrengthStory from './PasswordStrengthStory.vue';

const meta: Meta<typeof PasswordStrengthStory> = {
  component: PasswordStrengthStory,
  title: 'Components/PasswordStrength',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof PasswordStrengthStory>;

export const Default: Story = {};
