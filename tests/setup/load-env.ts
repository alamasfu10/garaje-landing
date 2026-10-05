import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local into process.env before any test runs.
// This makes SUPABASE_TEST_* and other vars available in all test workers.
function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local')
  let content: string
  try {
    content = readFileSync(envPath, 'utf-8')
  } catch {
    // .env.local not present — skip silently; CI should provide env vars directly
    return
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    // Only set if not already present (allow CI to override)
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvLocal()
