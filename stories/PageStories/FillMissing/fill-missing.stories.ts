import type { Meta, StoryObj } from '@storybook/vue3-vite';

import FillMissingStory from './FillMissingStory.vue';

const meta: Meta<typeof FillMissingStory> = {
  component: FillMissingStory,
  title: 'Pages/FillMissing',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof FillMissingStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

export const Default: Story = {
  argTypes: {
    context: disabledControl
  }
};

export const WithCustomFields: Story = {
  args: {
    context: {
      details: {
        fields: [
          'username',
          {
            name: 'department',
            type: 'text'
          },
          {
            name: 'phone_number',
            type: 'text'
          }
        ]
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};
