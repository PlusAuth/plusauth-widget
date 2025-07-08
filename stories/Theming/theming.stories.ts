import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ThemingStory from './ThemeStory.vue';
import WidgetColorPalette from './WidgetColorPalette.vue';

type Story = StoryObj<typeof ThemingStory>;

/**
 *
 */
const meta: Meta<typeof ThemingStory> = {
  component: ThemingStory,
  title: 'theming',
}

export default meta


/**
 * You can provide custom fields for your view
 */
export const Accents: Story = {
  args: {
    primary: '#e37006',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  argTypes: [
    'primary',
    'secondary',
    'accent',
    'error',
    'info',
    'success',
    'warning'
  ].reduce((final, type,) => {
    final[type] = {
      control: { type: 'color' }
    }
    return final
  }, {})

};


export const Palette: Story = {
  args: {
    primary: '#e37006',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  argTypes: [
    'primary',
    'secondary',
    'accent',
    'error',
    'info',
    'success',
    'warning'
  ].reduce((final, type,) => {
    final[type] = {
      control: { type: 'color' }
    }
    return final
  }, {}),
  render: (args) => ({
    components: { WidgetColorPalette },
    setup() {
      return { args };
    },
    template: '<WidgetColorPalette v-bind="args" />',
  })
}
