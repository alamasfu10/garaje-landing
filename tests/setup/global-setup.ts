import { spawn, type ChildProcess } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local into an object
function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  const env: Record<string, string> = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    env[key] = value
  }
  return env
}

let serverProcess: ChildProcess | null = null

export async function setup() {
  const envLocal = loadEnvLocal()

  // Build env for the test server: use TEST Supabase creds in place of prod ones
  const testEnv: NodeJS.ProcessEnv = {
    ...process.env,
    // Override Supabase prod vars with test project values
    SUPABASE_URL: envLocal.SUPABASE_TEST_URL,
    SUPABASE_SECRET: envLocal.SUPABASE_TEST_SECRET,
    SUPABASE_PUBLISHABLE: envLocal.SUPABASE_TEST_PUBLISHABLE,
    // Keep other vars
    STORYBLOK_TOKEN: envLocal.STORYBLOK_TOKEN,
    STORYBLOK_LOCATION: envLocal.STORYBLOK_LOCATION,
    NODE_ENV: 'test',
    PORT: '3001',
  }

  return new Promise<void>((resolve, reject) => {
    serverProcess = spawn('node_modules/.bin/next', ['dev', '--port', '3001'], {
      cwd: process.cwd(),
      env: testEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let started = false

    const onData = (chunk: Buffer) => {
      const text = chunk.toString()
      if (!started && text.includes('localhost:3001')) {
        started = true
        resolve()
      }
    }

    serverProcess.stdout?.on('data', onData)
    serverProcess.stderr?.on('data', onData)

    serverProcess.on('error', reject)

    // Timeout after 30s if server doesn't start
    setTimeout(() => {
      if (!started) reject(new Error('Test server did not start within 30s'))
    }, 30000)
  })
}

export async function teardown() {
  if (serverProcess) {
    serverProcess.kill('SIGTERM')
    serverProcess = null
  }
}
