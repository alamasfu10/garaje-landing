import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * Webhook de Storyblok para on-demand revalidation.
 *
 * En Storyblok: Settings → Webhooks → Story published/unpublished
 * URL: https://tu-dominio.com/api/revalidate?secret=TU_WEBHOOK_SECRET
 * Method: POST
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expected = process.env.STORYBLOK_WEBHOOK_SECRET

  if (!expected) {
    return NextResponse.json({ ok: false, error: 'Webhook secret not configured' }, { status: 503 })
  }

  if (secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 })
  }

  let slug = 'home'
  try {
    const body = await request.json() as { full_slug?: string; slug?: string }
    slug = body.full_slug ?? body.slug ?? 'home'
  } catch {
    // body vacío o malformado — revalidamos igualmente
  }

  revalidateTag('storyblok')
  revalidateTag(`story:${slug}`)

  console.info(`[Storyblok webhook] Revalidado — slug: ${slug}`)

  return NextResponse.json({ ok: true, revalidated: slug })
}
