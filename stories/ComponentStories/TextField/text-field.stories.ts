import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';

import TextFieldStory from './TextFieldStory.vue';

const meta: Meta<typeof TextFieldStory> = {
  component: TextFieldStory,
  title: 'Components/TextField',
  tags: ['!autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number']
    }
  }
};

export default meta;
type Story = StoryObj<typeof TextFieldStory>;

function getInput(canvasElement: HTMLElement, name: string): HTMLInputElement {
  const input = canvasElement.querySelector(`input[name="${name}"]`);

  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Expected input "${name}" was not rendered.`);
  }

  return input;
}

export const Default: Story = {};
Default.play = async ({ canvasElement }) => {
  const input = getInput(canvasElement, 'username');

  await userEvent.clear(input);
  await userEvent.type(input, 'plusauth-user');

  await expect(input).toHaveValue('plusauth-user');
};

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'plusauth-user'
  }
};
Disabled.play = async ({ canvasElement }) => {
  const input = getInput(canvasElement, 'username');

  await expect(input).toBeDisabled();
  await expect(input).toHaveValue('plusauth-user');
};

export const PasswordType: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password'
  }
};
PasswordType.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = getInput(canvasElement, 'password');
  const toggle = canvas.getByRole('button', { name: 'Show' });

  await expect(input).toHaveAttribute('type', 'password');

  await userEvent.click(toggle);
  await expect(input).toHaveAttribute('type', 'text');
  await expect(canvas.getByRole('button', { name: 'Hide' })).toBeInTheDocument();

  await userEvent.click(canvas.getByRole('button', { name: 'Hide' }));
  await expect(input).toHaveAttribute('type', 'password');
};
