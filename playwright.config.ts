import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const localEnvironmentPath = resolve(__dirname, '.env');

if (existsSync(localEnvironmentPath)) {
  process.loadEnvFile(localEnvironmentPath);
}

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : 4,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://bookstore.toolsqa.com',

    ignoreHTTPSErrors: true,

    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  outputDir: 'test-results',
});