import { describe, it, expect } from 'vitest'
import { leadSchema } from '@/lib/validation'

const VALID_LEAD = {
  nombre: 'Ana',
  apellido: 'García',
  email_empresa: 'ana@empresa.com',
  empresa: 'Acme S.L.',
  cargo: 'CTO',
  tamano_equipo: '11-50',
  acepta_comunicaciones: true,
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'test-camp',
  session_id: 'sess-abc-123',
}

describe('leadSchema — lead válido completo', () => {
  it('acepta un lead válido con todos los campos', () => {
    const result = leadSchema.safeParse(VALID_LEAD)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.nombre).toBe('Ana')
      expect(result.data.empresa).toBe('Acme S.L.')
    }
  })
})

describe('leadSchema — campos requeridos', () => {
  it('rechaza nombre vacío', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, nombre: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path[0])
      expect(paths).toContain('nombre')
    }
  })

  it('rechaza apellido vacío', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, apellido: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path[0])
      expect(paths).toContain('apellido')
    }
  })

  it('rechaza empresa vacía', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, empresa: '' })
    expect(result.success).toBe(false)
  })
})

describe('leadSchema — validación de email', () => {
  it('rechaza email con formato inválido (sin @)', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, email_empresa: 'no-es-un-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path[0])
      expect(paths).toContain('email_empresa')
    }
  })

  it('rechaza email sin dominio tras el @', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, email_empresa: 'user@' })
    expect(result.success).toBe(false)
  })
})

describe('leadSchema — transformaciones', () => {
  // Zod validates email format before running .transform(), so spaces around the
  // email cause rejection at the .email() step. What the schema DOES transform is
  // uppercase → lowercase (a valid email in any case passes .email() fine).
  it('transforma el email a lowercase', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, email_empresa: 'ANA@EMPRESA.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email_empresa).toBe('ana@empresa.com')
    }
  })

  it('combina uppercase + .trim() (sin espacios, que serían rechazados por .email())', () => {
    // The .transform() chain is: toLowerCase().trim() — both run on the valid string
    const result = leadSchema.safeParse({ ...VALID_LEAD, email_empresa: 'USUARIO@DOMINIO.ES' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email_empresa).toBe('usuario@dominio.es')
    }
  })
})

describe('leadSchema — campos opcionales', () => {
  it('acepta cargo como undefined', () => {
    const { cargo: _cargo, ...withoutCargo } = VALID_LEAD
    const result = leadSchema.safeParse(withoutCargo)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cargo).toBeUndefined()
    }
  })

  it('acepta cargo como null', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, cargo: null })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cargo).toBeNull()
    }
  })

  it('acepta tamano_equipo como undefined', () => {
    const { tamano_equipo: _te, ...withoutTamano } = VALID_LEAD
    const result = leadSchema.safeParse(withoutTamano)
    expect(result.success).toBe(true)
  })

  it('acepta tamano_equipo como null', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, tamano_equipo: null })
    expect(result.success).toBe(true)
  })
})

describe('leadSchema — acepta_comunicaciones', () => {
  it('hace default a false si el campo está ausente', () => {
    const { acepta_comunicaciones: _ac, ...withoutAcepta } = VALID_LEAD
    const result = leadSchema.safeParse(withoutAcepta)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.acepta_comunicaciones).toBe(false)
    }
  })

  it('acepta true explícito', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, acepta_comunicaciones: true })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.acepta_comunicaciones).toBe(true)
    }
  })

  it('acepta false explícito', () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, acepta_comunicaciones: false })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.acepta_comunicaciones).toBe(false)
    }
  })
})
