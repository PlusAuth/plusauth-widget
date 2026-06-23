import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import LoginStory from './LoginStory.vue';

const meta: Meta<typeof LoginStory> = {
  component: LoginStory,
  title: 'Pages/Login',
  tags: ['!autodocs']
};

export default meta;
type Story = StoryObj<typeof LoginStory>;
const disabledControl = {
  table: {
    disable: true
  }
};

function getInput(canvasElement: HTMLElement, name: string): HTMLInputElement {
  const input = canvasElement.querySelector(`input[name="${name}"]`);

  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Expected input "${name}" was not rendered.`);
  }

  return input;
}

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
  args: {
    fields: {}
  },
  argTypes: {
    context: disabledControl
  }
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const emailInput = getInput(canvasElement, 'email');
  const passwordInput = getInput(canvasElement, 'password');

  await withMockedFetch(canvasElement, async (requests) => {
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'demo@plusauth.com');
    await userEvent.type(passwordInput, 'SuperSecret123');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(requests).toHaveLength(1));
    await expect(JSON.parse(String(requests[0].body))).toMatchObject({
      email: 'demo@plusauth.com',
      password: 'SuperSecret123'
    });
  });
};

export const CustomFields: Story = {
  args: {
    fields: {
      terms_of_service: {
        type: 'checkbox',
        label: 'I accept the terms',
        order: 10
      },
      email: null,
      username: {
        type: 'text',
        label: 'Username',
        placeholder: 'Username here'
      }
    }
  },
  argTypes: {
    context: disabledControl
  }
};
CustomFields.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const usernameInput = getInput(canvasElement, 'username');

  await expect(usernameInput).toBeInTheDocument();
  await expect(canvas.getByRole('checkbox', { name: 'I accept the terms' })).toBeInTheDocument();
};

export const SocialConnections: Story = {
  args: {
    context: {
      client: {
        social: [
          {
            name: 'google',
            provider: 'google',
            branding: {
              display_name: 'Google',
              show_in_login: true
            }
          },
          {
            name: 'github',
            provider: 'github',
            branding: {
              display_name: 'GitHub',
              show_in_login: true
            }
          }
        ]
      }
    }
  },
  argTypes: {
    context: disabledControl,
    fields: disabledControl
  }
};
SocialConnections.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText('or')).toBeInTheDocument();
  await expect(canvas.getByRole('link', { name: 'Sign in with Google' })).toBeInTheDocument();
  await expect(canvas.getByRole('link', { name: 'Sign in with GitHub' })).toBeInTheDocument();
};
