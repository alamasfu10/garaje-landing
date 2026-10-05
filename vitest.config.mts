import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
    // Load .env.local for local development; CI provides env vars directly
    setupFiles: ['tests/setup/load-env.ts'],
  },
})
