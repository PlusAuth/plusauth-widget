import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import ConsentStory from './ConsentStory.vue';

const meta: Meta<typeof ConsentStory> = {
  component: ConsentStory,
  title: 'Pages/Consent',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof ConsentStory>;

async function withMockedFetch(
  canvasElement: HTMLElement,
  callback: (requests: RequestInit[]) => Promise<void>,
) {
  const view = canvasElement.ownerDocument.defaultView;
  const originalFetch = view?.fetch;
  const requests: RequestInit[] = [];

  if (!view || !originalFetch) {
    throw new Error('Window fetch is not available in Storybook test context.');
  }

  view.fetch = (async (_input, init) => {
    requests.push(init || {});
    return new view.Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }) as typeof view.fetch;

  try {
    await callback(requests);
  } finally {
    view.fetch = originalFetch;
  }
}

export const Default: Story = {
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await withMockedFetch(canvasElement, async (requests) => {
    await expect(canvas.getByText('Base Attributes')).toBeInTheDocument();
    await expect(canvas.getByText('Claims')).toBeInTheDocument();
    await expect(canvas.getByText('Calendar API')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Allow' }));
    await waitFor(() => expect(requests).toHaveLength(1));
    await expect(JSON.parse(String(requests[0].body))).toEqual({ accepted: true });

    await userEvent.click(canvas.getByRole('button', { name: 'Reject' }));
    await waitFor(() => expect(requests).toHaveLength(2));
    await expect(JSON.parse(String(requests[1].body))).toEqual({ accepted: false });
  });
};
