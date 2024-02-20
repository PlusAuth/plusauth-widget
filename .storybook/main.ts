import type {StorybookConfig} from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.@(md|mdx)", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: [{ from: '../stories/assets', to: '/assets' }],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links"
  ],

  core: {
    builder: '@storybook/builder-vite'
  },
  async viteFinal(config, {configType}) {
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
