/**
 * Integration tests for POST /api/leads.
 *
 * These tests call the Next.js route handler running on a dedicated test server
 * (port 3001) that is configured to use the TEST Supabase project. Prod is
 * never touched.
 *
 * The test server is managed by tests/setup/global-setup.ts via vitest
 * globalSetup (see vitest.integration.config.mts).
 */
import { describe, it, expect, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// The test server targets the TEST Supabase project
const TEST_SUPABASE_URL = process.env.SUPABASE_TEST_URL
const TEST_SUPABASE_KEY = process.env.SUPABASE_TEST_SECRET

if (!TEST_SUPABASE_URL || !TEST_SUPABASE_KEY) {
  throw new Error(
    'Bloqueo: faltan SUPABASE_TEST_URL y/o SUPABASE_TEST_SECRET. ' +
      'Ejecuta los tests de integración con vitest.integration.config.mts.'
  )
}

// Port 3001 = test server with TEST Supabase creds (started by global-setup.ts)
const BASE_URL = 'http://localhost:3001'

const supabaseTest = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_KEY, {
  auth: { persistSession: false },
})

// Track emails inserted during tests for teardown
const insertedEmails: string[] = []

const BASE_PAYLOAD = {
  nombre: 'Test',
  apellido: 'Integración',
  empresa: 'Test Corp',
  cargo: 'QA Engineer',
  tamano_equipo: '1-10',
  acepta_comunicaciones: false,
  utm_source: 'vitest',
  utm_medium: 'integration',
  utm_campaign: 'api-leads-test',
  session_id: 'vitest-session-001',
}

async function postLeads(payload: unknown) {
  return fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

describe('POST /api/leads — payload válido', () => {
  it('devuelve 200 con { ok: true } y la fila existe en Supabase TEST', async () => {
    const email = 'test-integracion-ok@ejemplo.com'
    insertedEmails.push(email)

    const res = await postLeads({ ...BASE_PAYLOAD, email_empresa: email })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ ok: true })

    // Verify the row was actually inserted in the TEST project (not prod)
    const { data, error } = await supabaseTest
      .from('leads')
      .select('id, email_empresa, nombre')
      .eq('email_empresa', email)
      .limit(1)

    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data![0].nombre).toBe('Test')
  })
})

describe('POST /api/leads — email inválido', () => {
  it('devuelve 400 y no inserta ninguna fila', async () => {
    const badEmail = 'no-es-un-email-valido'

    const res = await postLeads({ ...BASE_PAYLOAD, email_empresa: badEmail })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)

    // Confirm no row was inserted with this value
    const { data } = await supabaseTest
      .from('leads')
      .select('id')
      .eq('email_empresa', badEmail)
      .limit(1)

    expect(data ?? []).toHaveLength(0)
  })
})

describe('POST /api/leads — nombre vacío', () => {
  it('devuelve 400 y no inserta ninguna fila', async () => {
    const email = 'test-nombre-vacio@ejemplo.com'

    const res = await postLeads({ ...BASE_PAYLOAD, email_empresa: email, nombre: '' })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)

    // Confirm no row was inserted for this email
    const { data } = await supabaseTest
      .from('leads')
      .select('id')
      .eq('email_empresa', email)
      .limit(1)

    expect(data ?? []).toHaveLength(0)
  })
})

describe('POST /api/leads — JSON inválido', () => {
  it('devuelve 400 ante body que no es JSON válido', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'esto no es json {{{',
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)
  })
})

// Teardown: remove all rows inserted during the test run from Supabase TEST
afterAll(async () => {
  if (insertedEmails.length === 0) return

  const { error } = await supabaseTest
    .from('leads')
    .delete()
    .in('email_empresa', insertedEmails)

  if (error) {
    console.error('[teardown] Error eliminando leads de test:', error.message)
  } else {
    console.info(`[teardown] Eliminados ${insertedEmails.length} lead(s) de test de Supabase TEST`)
  }
})
