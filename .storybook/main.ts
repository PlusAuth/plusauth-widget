import type {StorybookConfig} from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.@(md|mdx)", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: [{ from: '../stories/public', to: '/' }],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links"
  ],

  core: {
    builder: '@storybook/builder-vite'
  },
  previewHead: (head, {configType}) => {
    if (configType === 'PRODUCTION') {
      return head?.replace(`<base target="_parent" />`, `<base href="${process.env.BASE_PATH || '/'}">`)
    }
    return head
  },
  managerHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return (`
<base href="${process.env.BASE_PATH || '/'}">
 ${head}
      `);
    }
  },
  async viteFinal(config, {configType}) {
    config.publicDir = false
    config.plugins = config.plugins?.filter(s => {
      return !['vite:lib-inject-css', 'vite:dts'].includes(s!["name"])
    }) || []

    return config
  },
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag"
  },
};
export default config;
