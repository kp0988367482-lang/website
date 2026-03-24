const fs = require('fs');
const { defineConfig } = require('@playwright/test');

const chromeChannel = fs.existsSync('/opt/google/chrome/chrome') ? 'chrome' : undefined;

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'output/playwright/report' }],
  ],
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: 'http://127.0.0.1:3200',
    browserName: 'chromium',
    channel: chromeChannel,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  webServer: {
    command: 'PORT=3200 npm run start',
    url: 'http://127.0.0.1:3200/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
