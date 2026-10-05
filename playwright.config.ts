import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local so SUPABASE_TEST_* vars are available in test workers
function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(__dirname, '.env.local'), 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env.local not present — CI provides env vars directly
  }
}

loadEnvLocal()

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
