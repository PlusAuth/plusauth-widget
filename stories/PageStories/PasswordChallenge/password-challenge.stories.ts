import type { Meta, StoryObj } from '@storybook/vue3-vite';

import PasswordChallengeStory from './PasswordChallengeStory.vue';

const meta: Meta<typeof PasswordChallengeStory> = {
  component: PasswordChallengeStory,
  title: 'Pages/PasswordChallenge',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof PasswordChallengeStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

export const Default: Story = {
  argTypes: {
    fields: disabledControl,
    context: disabledControl
  }
};

export const WithUsernameIdentifier: Story = {
  args: {
    context: {
      details: {
        username: 'plusauth-user',
        user_identifier: 'plusauth-user',
        identifier: 'username'
      }
    }
  },
  argTypes: {
    context: disabledControl,
    fields: disabledControl
  }
};
