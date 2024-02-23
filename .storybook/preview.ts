import type {Preview} from "@storybook/vue3";
import './global.css'

const preview: Preview = {
  parameters: {
    options: {
      // The `a` and `b` arguments in this function have a type of `import('@storybook/types').IndexEntry`. Remember that the function is executed in a JavaScript environment, so use JSDoc for IntelliSense to introspect it.
      storySort: (a, b) => {
        if (a.tags.includes('unattached-mdx')) {
          if (b.tags.includes('unattached-mdx')) {
            return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true});
          }
          return -1
        }
        if (b.tags.includes('unattached-mdx')) {
          return 1
        }
        if (a.type === 'docs') {
          if (b.type === 'docs') {
            return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true});
          }
          return -1
        }
        if (b.type === 'docs') {
          return 1
        }
        return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true});
      },
    },
  },
};

export default preview;
