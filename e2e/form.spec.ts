import { test, expect, type Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Always use the TEST Supabase project — never production
const TEST_SUPABASE_URL = process.env.SUPABASE_TEST_URL!
const TEST_SUPABASE_KEY = process.env.SUPABASE_TEST_SECRET!

if (!TEST_SUPABASE_URL || !TEST_SUPABASE_KEY) {
  throw new Error(
    'Bloqueo E2E: faltan SUPABASE_TEST_URL y/o SUPABASE_TEST_SECRET.'
  )
}

const supabaseTest = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_KEY, {
  auth: { persistSession: false },
})

const E2E_EMAIL = 'e2e-playwright-test@ejemplo.com'

// Helper: fill a floating-label field by its input id
async function fillField(page: Page, name: string, value: string) {
  await page.locator(`input[name="${name}"]`).fill(value)
}

test.describe('Landing → formulario → envío', () => {
  test.afterAll(async () => {
    // Teardown: remove the row created during E2E
    const { error } = await supabaseTest
      .from('leads')
      .delete()
      .eq('email_empresa', E2E_EMAIL)

    if (error) {
      console.error('[e2e teardown] Error eliminando lead:', error.message)
    } else {
      console.info('[e2e teardown] Lead de test eliminado de Supabase TEST')
    }
  })

  test('el hero carga con el título principal visible', async ({ page }) => {
    await page.goto('/')
    // The <h1> always shows evento_nombre (from CMS or fallback)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    const text = await h1.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('click en "Reservar plaza" hace scroll al formulario', async ({ page }) => {
    await page.goto('/')

    // Click the CTA in the hero (anchor that links to #formulario)
    await page.locator('a[href="#formulario"]').first().click()

    // The form section should now be visible
    const formSection = page.locator('section#formulario')
    await expect(formSection).toBeVisible()
  })

  test('rellenar y enviar el formulario → estado de éxito → lead en Supabase TEST', async ({ page }) => {
    // Capture generate_lead analytics event if fired (non-blocking assertion)
    const analyticsEvents: string[] = []
    await page.addInitScript(() => {
      // Stub gtag so we can track calls without a real GA property
      window.gtag = (...args: unknown[]) => {
        if (args[0] === 'event') {
          ;(window as typeof window & { __capturedEvents: string[] }).__capturedEvents =
            (window as typeof window & { __capturedEvents: string[] }).__capturedEvents ?? []
          ;(window as typeof window & { __capturedEvents: string[] }).__capturedEvents.push(
            args[1] as string
          )
        }
      }
    })

    await page.goto('/')

    // Scroll to form
    await page.locator('a[href="#formulario"]').first().click()
    await page.waitForSelector('section#formulario form')

    // Fill every field
    await fillField(page, 'nombre', 'Playwright')
    await fillField(page, 'apellido', 'Test')
    await fillField(page, 'email_empresa', E2E_EMAIL)
    await fillField(page, 'empresa', 'QA Corp E2E')
    await fillField(page, 'cargo', 'Automation Engineer')
    await fillField(page, 'tamano_equipo', '1-10')

    // Checkbox: acepta_comunicaciones — default is true (checked). Leave as-is.
    const checkbox = page.locator('input[type="checkbox"]')
    await expect(checkbox).toBeChecked()

    // Submit
    await page.locator('button[type="submit"]').click()

    // Wait for success state
    await expect(page.getByText('¡Solicitud recibida!')).toBeVisible({ timeout: 10000 })

    // Verify the row was inserted in Supabase TEST (not prod)
    const { data, error } = await supabaseTest
      .from('leads')
      .select('id, nombre, apellido, email_empresa')
      .eq('email_empresa', E2E_EMAIL)
      .limit(1)

    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data![0].nombre).toBe('Playwright')
    expect(data![0].apellido).toBe('Test')

    // Collect any analytics events that were captured (informational)
    const captured = await page.evaluate(
      () => (window as typeof window & { __capturedEvents?: string[] }).__capturedEvents ?? []
    )
    analyticsEvents.push(...captured)
    console.info('[e2e] Eventos de analytics capturados:', analyticsEvents)
  })
})
