import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import CodeInputStory from './CodeInputStory.vue';

const meta: Meta<typeof CodeInputStory> = {
  component: CodeInputStory,
  title: 'Components/CodeInput',
  tags: ['!autodocs'],
  argTypes: {
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    size: {
      control: {
        type: 'number',
        min: 4,
        max: 8,
        step: 1
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof CodeInputStory>;

const disabledControl = {
  control: false,
  table: {
    disable: true
  }
};

export const Default: Story = {};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = canvas.getAllByRole('textbox');

  await expect(canvas.getByText('Verification Code')).toBeInTheDocument();
  await expect(inputs).toHaveLength(6);

  await userEvent.type(inputs[0], '1');
  await expect(inputs[0]).toHaveValue('1');
  await expect(inputs[1]).toHaveFocus();
};

export const FourDigitCode: Story = {
  args: {
    size: 4
  },
  argTypes: {
    size: disabledControl
  }
};
FourDigitCode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = canvas.getAllByRole('textbox');

  await expect(inputs).toHaveLength(4);
};

export const PreFilledCode: Story = {
  args: {
    modelValue: '123456'
  },
  argTypes: {
    modelValue: disabledControl,
    size: disabledControl
  }
};
PreFilledCode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputs = canvas.getAllByRole('textbox') as HTMLInputElement[];

  await expect(inputs.map((input) => input.value).join('')).toBe('123456');
};
