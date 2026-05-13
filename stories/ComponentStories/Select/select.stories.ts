import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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

function getSelectRoot(canvasElement: HTMLElement): HTMLElement {
  const select = canvasElement.querySelector('.pa__input-select');

  if (!(select instanceof HTMLElement)) {
    throw new Error('Expected locale select was not rendered.');
  }

  return select;
}

export const FooterLocaleSelect: Story = {};
FooterLocaleSelect.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const select = getSelectRoot(canvasElement);

  await expect(canvas.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument();
  await expect(canvas.getByRole('link', { name: 'Privacy Policy' })).toBeInTheDocument();
  await expect(select).toHaveTextContent('English');

  await userEvent.click(select);

  const turkishOption = Array.from(
    canvasElement.querySelectorAll('.pa__input-select-item')
  ).find((item) => item.textContent?.includes('Türkçe')) as HTMLElement | undefined;

  await expect(turkishOption).toBeDefined();
  await userEvent.click(turkishOption as HTMLElement);

  await waitFor(() => expect(select).toHaveTextContent('Türkçe'));
};
