import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PasswordRecoveryStory from './PasswordRecoveryStory.vue';

const meta: Meta<typeof PasswordRecoveryStory> = {
  component: PasswordRecoveryStory,
  title: 'Pages/PasswordRecovery',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof PasswordRecoveryStory>;

export const Default: Story = {
  args: {
    fields: {}
  }
};

export const CustomFields: Story = {
  args: {
    fields: {
      captcha: {
        type: 'text',
        label: 'Enter the code above',
        order: 2
      }
    }
  }
};