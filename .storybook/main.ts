import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(md|mdx)', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [{ from: '../stories/public', to: '/' }],
  addons: [
    '@storybook/addon-links',
    'storybook-addon-vue-mdx',
    '@storybook/addon-docs',
    '@storybook/addon-vitest'
  ],

  core: {
    builder: '@storybook/builder-vite'
  },
  previewHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return head?.replace('<base target="_parent" />', `<base href="${process.env.STORYBOOK_BASE_PATH || '/'}">`)
    }
    return head
  },
  managerHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return `
<base href="${process.env.STORYBOOK_BASE_PATH || '/'}">
 ${head}
      `;
    }
    return head
  },
  async viteFinal(config) {
    config.publicDir = false
    // TODO: https://github.com/vuejs/language-tools/issues/3969
    config.plugins = config.plugins?.filter((p: any) => {
      return !['vite-plugin-checker'].includes(p.name);
    })
    config.resolve = config.resolve || {}
    config.resolve.dedupe = [
      ...config.resolve.dedupe || [],
      'react',
      'react-dom',
    ]
    config.oxc = {
      ...config.oxc,
      jsx: 'automatic',
      jsxImportSource: 'react',
    } as any
    return config
  },
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
