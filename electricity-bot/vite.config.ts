import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import storybookTest from '@storybook/addon-vitest/vitest-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      defineConfig({ // unit tests
        test: {
          setupFiles: ['./.storybook/vitest.setup.ts'],
          include: ['src/**/*.test.ts'],
        },
      }),

      defineConfig({ // storybook browser tests
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          setupFiles: ['./.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      }),
    ],
  },
});