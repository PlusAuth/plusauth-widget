import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CssVariablesStory from './CssVariablesStory.vue';

type CssVariableArgs = Record<string, string | number>;
type CssVariableDefinition = {
  arg: string;
  variable: string;
  defaultValue: string | number;
  control: unknown;
};
type Story = StoryObj<typeof CssVariablesStory> & {
  args: CssVariableArgs;
  argTypes: Record<string, unknown>;
};

const fontWeightControl = {
  control: 'select',
  options: [100, 200, 300, 400, 500, 600, 700, 800, 900]
};

const textAlignControl = {
  control: 'select',
  options: ['start', 'center', 'end', 'left', 'right']
};

const boxAlignControl = {
  control: 'select',
  options: ['start', 'center', 'end']
};

const inputVariantControl = {
  control: 'select',
  options: [0, 1, 2, 3, 4, 5],
  labels: {
    0: 'outlined',
    1: 'filled',
    2: 'underlined',
    3: 'solo',
    4: 'plain',
    5: 'regular'
  }
};

const buttonVariantControl = {
  control: 'select',
  options: [0, 1, 2, 3, 4, 5],
  labels: {
    0: 'flat',
    1: 'elevated',
    2: 'tonal',
    3: 'outlined',
    4: 'text',
    5: 'plain'
  }
};

const cssVariableDefinitions: CssVariableDefinition[] = [
  { arg: 'paFsP', variable: '--pa-fs-p', defaultValue: '16px', control: { control: 'text' } },
  { arg: 'paFsH1', variable: '--pa-fs-h1', defaultValue: '20px', control: { control: 'text' } },
  { arg: 'paFsH2', variable: '--pa-fs-h2', defaultValue: '18px', control: { control: 'text' } },
  { arg: 'paFwP', variable: '--pa-fw-p', defaultValue: 400, control: fontWeightControl },
  { arg: 'paFwH1', variable: '--pa-fw-h1', defaultValue: 400, control: fontWeightControl },
  { arg: 'paFwH2', variable: '--pa-fw-h2', defaultValue: 400, control: fontWeightControl },
  { arg: 'paAlignP', variable: '--pa-align-p', defaultValue: 'start', control: textAlignControl },
  { arg: 'paAlignH1', variable: '--pa-align-h1', defaultValue: 'center', control: textAlignControl },
  { arg: 'paAlignH2', variable: '--pa-align-h2', defaultValue: 'center', control: textAlignControl },
  { arg: 'paInputRadius', variable: '--pa-input-radius', defaultValue: '0px', control: { control: 'text' } },
  { arg: 'paInputBorderW', variable: '--pa-input-border-w', defaultValue: '1px', control: { control: 'text' } },
  { arg: 'paMainRadius', variable: '--pa-main-radius', defaultValue: '0px', control: { control: 'text' } },
  { arg: 'paMainBorderW', variable: '--pa-main-border-w', defaultValue: '1px', control: { control: 'text' } },
  { arg: 'paMainBorderC', variable: '--pa-main-border-c', defaultValue: '#e2e8f0', control: { control: 'color' } },
  {
    arg: 'paMainBg',
    variable: '--pa-main-bg',
    defaultValue: "url('https://c4.wallpaperflare.com/wallpaper/822/923/603/firewatch-mountains-forest-video-games-wallpaper-preview.jpg') center/cover no-repeat",
    control: { control: 'text' }
  },
  { arg: 'paWidgetAlign', variable: '--pa-widget-align', defaultValue: 'start', control: boxAlignControl },
  { arg: 'paWidgetState', variable: '--pa-widget-state', defaultValue: 1, control: { control: 'select', options: [0, 1] } },
  { arg: 'paInputVariant', variable: '--pa-input-variant', defaultValue: 5, control: inputVariantControl },
  { arg: 'paButtonVariant', variable: '--pa-button-variant', defaultValue: 2, control: buttonVariantControl },
  { arg: 'paLogoAlign', variable: '--pa-logo-align', defaultValue: 'center', control: boxAlignControl },
];

const cssVariableDefaults = cssVariableDefinitions.reduce((final, definition) => {
  final[definition.arg] = definition.defaultValue;
  return final;
}, {} as CssVariableArgs);

const argTypes = cssVariableDefinitions.reduce((final, definition) => {
  final[definition.arg] = {
    ...(definition.control as Record<string, unknown>),
    name: definition.variable
  };
  return final;
}, {} as Record<string, unknown>);

argTypes.cssVariables = {
  control: false,
  table: { disable: true }
};

const toCssVariableStyles = (args: CssVariableArgs = cssVariableDefaults) =>
  cssVariableDefinitions.reduce((final, definition) => {
    final[definition.variable] = args[definition.arg] ?? definition.defaultValue;
    return final;
  }, {
    height: '100%'
  } as Record<string, string | number>);

const meta: Meta<typeof CssVariablesStory> = {
  component: CssVariablesStory,
  title: 'CSS Variables',
  tags: ['!autodocs']
}

export default meta;

export const Default: Story = {
  args: cssVariableDefaults,
  argTypes,
  render: (args) => ({
    components: { CssVariablesStory },
    setup() {
      const cssVariableStyles = computed(() => toCssVariableStyles(args as CssVariableArgs));
      return { cssVariableStyles };
    },
    template: '<CssVariablesStory :css-variables="cssVariableStyles" />'
  })
}
