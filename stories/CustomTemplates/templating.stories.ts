import type { Meta, StoryObj } from '@storybook/vue3';

import ContentFooterTemplate from './CustomTemplating.vue';

type Story = StoryObj<typeof ContentFooterTemplate>;


const ArgTypes = {
  template: {
    name: 'Enter your custom template:'
  },
  settings: {
    control: false,
    table: {
      disable: true
    }
  },
  context: {
    control: false,
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
			<style>
					#myId {
						border: 1px solid black;
						padding: 12px;
						background: red;
						color: white;
					}
			</style>
      <a href="https://myuri" id="myId">My Uri</a>
    </template>`
  },
};

export const ContentAppend: Story = {
  name: 'content-append',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-append">
     	<style>
					#myId {
						border: 1px solid black;
						margin-bottom: 24px;
						padding: 12px;
						background: red;
						color: white;
					}
			</style>
      <a href="https://myuri" id="myId">My Uri</a>
    </template>`
  },
};

export const ContentFooter: Story = {
  name: 'content-footer',
  argTypes: ArgTypes,
  args: {
    template: `<template id="pa-content-footer">
     	<style>
					#myId {
						display: flex;
						border: 1px solid black;
						padding: 12px;
						background: red;
						color: white;
					}
			</style>
      <a href="https://myuri" id="myId">My Uri</a>
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
