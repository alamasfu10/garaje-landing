import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/api-leads.test.ts'],
    globals: true,
    // Load .env.local into process.env in each worker before tests run
    setupFiles: ['tests/setup/load-env.ts'],
    // Starts a test Next.js server on port 3001 with TEST Supabase creds
    globalSetup: ['tests/setup/global-setup.ts'],
    testTimeout: 30000,
    hookTimeout: 60000,
    // Force exit after tests complete — avoids hanging Supabase WS connections
    pool: 'forks',
  },
})
