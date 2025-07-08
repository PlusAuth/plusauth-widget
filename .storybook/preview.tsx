import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/vue3-vite';
import './preview.css'

import React from 'react';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      canvas: {
      },
      page: () =>
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
        </>
      ,
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '400px',
            height: '900px',
          },
        },
        laptop: {
          name: 'Laptop',
          styles: {
            width: '1366px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      }
    },
    options: {
      // The `a` and `b` arguments in this function have a type of `import('storybook/internal/types').IndexEntry`. Remember that the function is executed in a JavaScript environment, so use JSDoc for IntelliSense to introspect it.
      storySort: (a, b) => {
        if (a.tags.includes('unattached-mdx')) {
          if (b.tags.includes('unattached-mdx')) {
            return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true });
          }
          return -1
        }
        if (b.tags.includes('unattached-mdx')) {
          return 1
        }
        if (a.type === 'docs') {
          if (b.type === 'docs') {
            return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true });
          }
          return -1
        }
        if (b.type === 'docs') {
          return 1
        }
        return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true });
      },
    },
  },
};

export default preview;
