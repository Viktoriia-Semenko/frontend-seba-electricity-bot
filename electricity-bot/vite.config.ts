import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import storybookTest from '@storybook/addon-vitest/vitest-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      // 👇 UNIT tests
      defineConfig({
        test: {
          setupFiles: ['./.storybook/vitest.setup.ts'],
          include: ['src/**/*.test.ts'],
        },
      }),

      // 👇 Storybook browser tests
      defineConfig({
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