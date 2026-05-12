import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MFAStory from '../MFA/MFAStory.vue';


const meta: Meta<typeof MFAStory> = {
  component: MFAStory,
  title: 'Pages/Passwordless',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof MFAStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

export const EmailChallenge: Story = {
  args: {
    mode: 'passwordless-email',
  },
  argTypes: {
    prompt: disabledControl
  }
};

export const SMSChallenge: Story = {
  args: {
    mode: 'passwordless-sms',
  },
  argTypes: {
    prompt: disabledControl
  }
};

export const OTPChallenge: Story = {
  args: {
    mode: 'passwordless-otp',
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
    mode: 'passwordless-push',
    prompt: 'Enroll'
  },
  argTypes: {
    prompt: {
      control: 'select',
      options: ['Enroll', 'Select Code', 'Manual', 'Approve On Device'],
      description: 'The prompt parameter for the push challenge'
    }
  }
};

export const SecurityDeviceChallenge: Story = {
  args: {
    mode: 'passwordless-webauthn',
  },
  argTypes: {
    prompt: disabledControl
  }
};

// export const EmailChallenge: Story = {
//   args: {
//     mode: 'passwordless-email'
//   }
// };
