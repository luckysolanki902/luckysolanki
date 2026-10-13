import { defineConfig } from '@playwright/test';

const port = process.env.PORTFOLIO_PORT || '3000';
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/game',
  timeout: 30_000,
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: { command: `npm run dev -- --port ${port}`, url: baseURL, reuseExistingServer: true, timeout: 120_000 },
  reporter: 'list',
});
