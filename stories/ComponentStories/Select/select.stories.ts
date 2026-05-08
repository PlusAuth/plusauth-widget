import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SelectStory from './SelectStory.vue';

const meta: Meta<typeof SelectStory> = {
  component: SelectStory,
  title: 'Components/Select',
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof SelectStory>;

export const FooterLocaleSelect: Story = {};
