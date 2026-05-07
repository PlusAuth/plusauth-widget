import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MFAStory from './MFAStory.vue';

const meta: Meta<typeof MFAStory> = {
  component: MFAStory,
  title: 'Pages/MFA',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof MFAStory>;

export const MFAChallenge: Story = {
  args: {
    mode: 'mfa'
  }
};

export const EmailChallenge: Story = {
  args: {
    mode: 'mfa-email',
  }
};

export const SMSChallenge: Story = {
  args: {
    mode: 'mfa-sms',
  }
};

export const OTPChallenge: Story = {
  args: {
    mode: 'mfa-otp',
    prompt: 'Default'
  },
  argTypes: {
    prompt: {
      control: 'select',
      options: ['Default', 'QR Setup', 'Manual Setup'],
      description: 'The prompt parameter for the push challenge'
    }
  }
};

export const PushChallenge: Story = {
  args: {
    mode: 'mfa-push',
  },
  argTypes: {
    prompt: {
      control: 'select',
      options: ['default', 'login', 'consent', 'select_account'],
      description: 'The prompt parameter for the push challenge'
    }
  }
};

export const SecurityDeviceChallenge: Story = {
  args: {
    mode: 'mfa-webauthn',
  },
};

export const FingerVeinChallenge: Story = {
  args: {
    mode: 'mfa-fv',
  },
};

// export const EmailChallenge: Story = {
//   args: {
//     mode: 'mfa-email'
//   }
// };