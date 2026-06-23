import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolvedViteConfig =
  typeof viteConfig === 'function'
    ? await viteConfig({ command: 'serve', mode: 'test' })
    : viteConfig;

export default mergeConfig(
  resolvedViteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              storybookScript: 'npm run storybook -- --no-open',
              storybookUrl: 'http://127.0.0.1:6006',
            }),
          ],
          test: {
            name: 'storybook',
            setupFiles: ['./.storybook/vitest.setup.ts'],
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: [{ browser: 'chromium' }],
              api: {
                host: '127.0.0.1',
                port: 63315,
              },
            },
          },
        },
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            include: ['tests/components/**/*.{test,spec}.{ts,tsx,js,jsx}'],
          },
        },
      ],
    },
  }),
);
