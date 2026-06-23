import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ContentFooterTemplate from './CustomTemplating.vue';

type Story = StoryObj<typeof ContentFooterTemplate>;


const ArgTypes = {
  template: {
    name: 'Enter your custom template:'
  },
  settings: {
    
    table: {
      disable: true
    }
  },
  context: {
    
    table: {
      disable: true
    }
  }
}

export const ContentPrepend: Story = {
  name: 'content-prepend',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-prepend">
			<a id="myId">-> My Uri</a>
    </template>`
  },
};

export const ContentAppend: Story = {
  name: 'content-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-append">
     	<a id="myId">-> My Uri</a>
    </template>`
  },
};

export const ContentFooter: Story = {
  name: 'content-footer',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-footer">
     	<a id="myId">-> My Uri</a>
    </template>`
  },
};

export const ContentActionsPrepend: Story = {
  name: 'content-actions-prepend',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-actions-prepend">
      <a id="myId">-> Before action</a>
    </template>`
  },
};

export const ContentActionsAppend: Story = {
  name: 'content-actions-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-actions-append">
      <a id="myId">-> After action</a>
    </template>`
  },
};

export const FormPrepend: Story = {
  name: 'form-prepend',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-form-prepend">
      <a id="myId">-> Before form fields</a>
    </template>`
  },
};

export const FormAppend: Story = {
  name: 'form-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-form-append">
      <a id="myId">-> After form fields</a>
    </template>`
  },
};

export const SocialPrepend: Story = {
  name: 'social-prepend',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-social-prepend">
      <a id="myId">-> Before social list</a>
    </template>`,
    context: {
      client: {
        social: [
          { name: 'google-connection', provider: 'google' },
          { name: 'facebook-connection', provider: 'facebook' },
        ]
      }
    }
  },
};

export const SocialAppend: Story = {
  name: 'social-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-social-append">
      <a id="myId">-> After social list</a>
    </template>`,
    context: {
      client: {
        social: [
          { name: 'google-connection', provider: 'google' },
          { name: 'facebook-connection', provider: 'facebook' },
        ]
      }
    }
  },
};


export const InfoAppend: Story = {
  name: 'info-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-info-append">
      <a id="myId">-> My Uri</a>
    </template>`
  },
};

export const FooterBody: Story = {
  name: 'footer-body',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-footer-body">
      <a id="myId">-> My Uri 1</a>
      <a id="myId">-> My Uri 2</a>
    </template>`
  },
};

/**
 *
 */
const meta: Meta<typeof ContentFooterTemplate> = {
  component: ContentFooterTemplate,
  title: 'Custom Templates',
  tags: ['!autodocs']
}


export default meta
