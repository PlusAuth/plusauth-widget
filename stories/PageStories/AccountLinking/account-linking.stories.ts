import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AccountLinkingStory from './AccountLinkingStory.vue';

const meta: Meta<typeof AccountLinkingStory> = {
  component: AccountLinkingStory,
  title: 'Pages/AccountLinking',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof AccountLinkingStory>;

export const PasswordVerification: Story = {
};
