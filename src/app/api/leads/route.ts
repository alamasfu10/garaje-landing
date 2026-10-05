import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/validation'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return NextResponse.json(
      { ok: false, error: firstError?.message ?? 'Datos inválidos' },
      { status: 400 }
    )
  }

  const lead = parsed.data

  let supabase
  try {
    supabase = createSupabaseServerClient()
  } catch {
    console.error('Supabase not configured')
    return NextResponse.json({ ok: false, error: 'Server configuration error' }, { status: 503 })
  }

  const { error } = await supabase.from('leads').insert({
    nombre: lead.nombre,
    apellido: lead.apellido,
    email_empresa: lead.email_empresa,
    empresa: lead.empresa,
    cargo: lead.cargo ?? null,
    tamano_equipo: lead.tamano_equipo ?? null,
    acepta_comunicaciones: lead.acepta_comunicaciones,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    session_id: lead.session_id ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error.message)
    const detail = process.env.NODE_ENV === 'development' ? error.message : 'Error al guardar. Inténtalo de nuevo.'
    return NextResponse.json({ ok: false, error: detail }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
