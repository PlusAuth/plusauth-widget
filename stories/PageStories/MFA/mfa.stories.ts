import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MFAStory from './MFAStory.vue';

const meta: Meta<typeof MFAStory> = {
  component: MFAStory,
  title: 'Pages/MFA',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof MFAStory>;
const disabledControl = {
  control: false,
  table: {
    disable: true
  }
};

export const MFAChallenge: Story = {
  args: {
    mode: 'mfa'
  },
  argTypes: {
    mode: disabledControl,
    prompt: disabledControl
  }
};

export const EmailChallenge: Story = {
  args: {
    mode: 'mfa-email',
  },
  argTypes: {
    mode: disabledControl,
    prompt: disabledControl
  }
};

export const SMSChallenge: Story = {
  args: {
    mode: 'mfa-sms',
  },
  argTypes: {
    mode: disabledControl,
    prompt: disabledControl
  }
};

export const OTPChallenge: Story = {
  args: {
    mode: 'mfa-otp',
    prompt: 'Default'
  },
  argTypes: {
    mode: disabledControl,
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
    prompt: 'Enroll'
  },
  argTypes: {
    mode: disabledControl,
    prompt: {
      control: 'select',
      options: ['Enroll', 'Select Code', 'Manual', 'Approve On Device'],
      description: 'The prompt parameter for the push challenge'
    }
  }
};

export const SecurityDeviceChallenge: Story = {
  args: {
    mode: 'mfa-webauthn',
  },
  argTypes: {
    mode: disabledControl,
    prompt: disabledControl
  }
};

export const FingerVeinChallenge: Story = {
  args: {
    mode: 'mfa-fv',
  },
  argTypes: {
    mode: disabledControl,
    prompt: disabledControl
  }
};

// export const EmailChallenge: Story = {
//   args: {
//     mode: 'mfa-email'
//   }
// };
