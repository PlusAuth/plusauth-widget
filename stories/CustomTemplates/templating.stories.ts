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
			<a id="myId">&#x2192My Uri</a>
    </template>`
  },
};

export const ContentAppend: Story = {
  name: 'content-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-append">
     	<a id="myId">&#x2192My Uri</a>
    </template>`
  },
};

export const ContentFooter: Story = {
  name: 'content-footer',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-footer">
     	<a id="myId">&#x2192My Uri</a>
    </template>`
  },
};


export const InfoAppend: Story = {
  name: 'info-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-info-append">
      <a id="myId">&#x2192My Uri</a>
    </template>`
  },
};

export const FooterBody: Story = {
  name: 'footer-body',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-footer-body">
      <a id="myId">&#x2192My Uri 1</a>
      <a id="myId">&#x2192My Uri 2</a>
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
