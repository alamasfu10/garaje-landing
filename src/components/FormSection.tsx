'use client'

import { useState, useEffect, useRef } from 'react'

interface FormState {
  nombre: string
  apellido: string
  email_empresa: string
  empresa: string
  cargo: string
  tamano_equipo: string
  acepta_comunicaciones: boolean
}

const INITIAL: FormState = {
  nombre: '',
  apellido: '',
  email_empresa: '',
  empresa: '',
  cargo: '',
  tamano_equipo: '',
  acepta_comunicaciones: true,
}

interface FloatingFieldProps {
  name: keyof Omit<FormState, 'acepta_comunicaciones'>
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  required?: boolean
}

function FloatingField({ name, label, type = 'text', value, onChange, required }: FloatingFieldProps) {
  const [focused, setFocused] = useState(false)
  const floating = focused || value.length > 0

  const border = focused
    ? '1px solid rgba(255,255,255,0.72)'
    : '1px solid rgba(255,255,255,0.32)'

  const labelColor = focused
    ? 'rgba(255,255,255,0.72)'
    : floating
      ? 'rgba(255,255,255,0.56)'
      : 'rgba(255,255,255,0.4)'

  return (
    <div className="fl-field">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={type === 'email' ? 'email' : 'off'}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="fl-field__input"
        style={{
          color: 'var(--text-inverse)',
          borderBottom: border,
          transition: `border-color var(--dur-quick) var(--ease-out)`,
        }}
        aria-label={label}
      />
      <label
        htmlFor={name}
        className={`fl-field__label${floating ? ' fl-field__label--float' : ''}`}
        style={{ color: labelColor }}
      >
        {label}
      </label>
    </div>
  )
}

export default function FormSection() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const sessionRef = useRef<string | null>(null)
  const utmRef = useRef<Record<string, string>>({})

  useEffect(() => {
    if (!sessionRef.current) {
      sessionRef.current = crypto.randomUUID()
    }
    const params = new URLSearchParams(window.location.search)
    utmRef.current = {
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
    }
  }, [])

  function set(field: keyof FormState) {
    return (val: string | boolean) =>
      setForm((prev) => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...utmRef.current,
          session_id: sessionRef.current,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? 'Error al enviar el formulario')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const inverseSection = {
    background: 'var(--surface-inverse)',
    color: 'var(--text-inverse)',
    padding: 'clamp(80px, 12vw, 160px) 0',
  } as const

  if (status === 'success') {
    return (
      <section id="formulario" style={inverseSection}>
        <div
          className="page-content"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--scrim-paper-08)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            ¡Solicitud recibida!
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: '44ch',
              fontFamily: 'var(--font-sans)',
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--text-inverse-quiet)',
            }}
          >
            Hemos recibido tu solicitud. Te confirmaremos la plaza por email antes del 10 de junio.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="formulario" style={inverseSection}>
      <div className="page-content">
        <div className="form-grid">

          {/* Left — title */}
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                background: 'var(--scrim-paper-08)',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-inverse)',
                letterSpacing: '0.01em',
                marginBottom: 32,
              }}
            >
              Reserva
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(48px, 7vw, 96px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--text-inverse)',
              }}
            >
              Reserva tu plaza
            </h2>
            <p
              style={{
                margin: '32px 0 0',
                maxWidth: '38ch',
                fontFamily: 'var(--font-sans)',
                fontSize: 16,
                lineHeight: 1.55,
                color: 'var(--text-inverse-quiet)',
              }}
            >
              Plazas limitadas a 40 profesionales. Te confirmaremos asistencia por email antes del 10 de junio.
            </p>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            <div className="form-fields-grid">
              <FloatingField name="nombre" label="Nombre" value={form.nombre} onChange={set('nombre') as (v: string) => void} required />
              <FloatingField name="apellido" label="Apellido" value={form.apellido} onChange={set('apellido') as (v: string) => void} required />
              <div className="full">
                <FloatingField name="email_empresa" label="Email de empresa" type="email" value={form.email_empresa} onChange={set('email_empresa') as (v: string) => void} required />
              </div>
              <FloatingField name="empresa" label="Empresa" value={form.empresa} onChange={set('empresa') as (v: string) => void} required />
              <FloatingField name="cargo" label="Cargo" value={form.cargo} onChange={set('cargo') as (v: string) => void} />
              <div className="full">
                <FloatingField name="tamano_equipo" label="Tamaño de tu equipo" value={form.tamano_equipo} onChange={set('tamano_equipo') as (v: string) => void} />
              </div>
            </div>

            {/* Consent */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: 'var(--text-inverse)',
                }}
              >
                <span style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
                  <input
                    type="checkbox"
                    checked={form.acepta_comunicaciones}
                    onChange={(e) => set('acepta_comunicaciones')(e.target.checked)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      width: 18,
                      height: 18,
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      borderRadius: 3,
                      background: form.acepta_comunicaciones ? 'var(--neutral-paper)' : 'transparent',
                      cursor: 'pointer',
                      display: 'block',
                      transition: 'background var(--dur-quick) var(--ease-out), border-color var(--dur-quick) var(--ease-out)',
                    }}
                  />
                  {form.acepta_comunicaciones && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
                      aria-hidden="true"
                    >
                      <polyline points="2 6 5 9 10 3" stroke="var(--neutral-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                Acepto recibir comunicaciones de Garaje de Ideas.
              </label>

              <p
                style={{
                  margin: '0 0 0 30px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--text-inverse-quiet)',
                  maxWidth: '52ch',
                }}
              >
                Al registrarme, autorizo a Garaje de Ideas a almacenar y procesar la información personal enviada y acepto la{' '}
                <a
                  href="#"
                  style={{
                    color: 'var(--text-inverse)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  política de privacidad
                </a>
                .
              </p>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p
                role="alert"
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  color: '#f87171',
                }}
              >
                {errorMsg || 'Ha ocurrido un error. Inténtalo de nuevo.'}
              </p>
            )}

            {/* Submit */}
            <div style={{ marginTop: 8 }}>
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '20px 32px',
                  height: 60,
                  background: status === 'loading' ? 'rgba(255,255,255,0.7)' : 'var(--action-inverse-bg)',
                  color: 'var(--action-inverse-fg)',
                  borderRadius: 'var(--radius-pill)',
                  border: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition:
                    'transform var(--dur-base) var(--ease-out), opacity var(--dur-quick) var(--ease-out)',
                }}
              >
                {status === 'loading' ? 'Enviando…' : 'Reservar plaza'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
          align-items: start;
        }
        .form-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 40px;
          row-gap: 28px;
        }
        .form-fields-grid .full {
          grid-column: 1 / -1;
        }
        @media (max-width: 880px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .form-fields-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
