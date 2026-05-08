import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ConsentStory from './ConsentStory.vue';

const meta: Meta<typeof ConsentStory> = {
  component: ConsentStory,
  title: 'Pages/Consent',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof ConsentStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

export const Default: Story = {
};

