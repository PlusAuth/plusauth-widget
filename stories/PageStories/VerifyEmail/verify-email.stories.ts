import type { Meta, StoryObj } from '@storybook/vue3-vite';

import VerifyEmailStory from './VerifyEmailStory.vue';

const meta: Meta<typeof VerifyEmailStory> = {
  component: VerifyEmailStory,
  title: 'Pages/VerifyEmail',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof VerifyEmailStory>;
const disabledControl = {
  
  table: {
    disable: true
  }
};

export const PendingVerification: Story = {
  argTypes: {
    context: disabledControl
  }
};

export const VerificationCompleted: Story = {
  args: {
    context: {
      details: {
        email: 'john@example.com',
        email_verified: true
      },
      prompt: {
        name: 'verify_email',
        mode: 'complete'
      },
      settings: {
        auto_sign_in: false
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};

export const ErrorState: Story = {
  args: {
    context: {
      error: {
        error: 'email_not_verified',
        error_description: 'Email is not verified'
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};
