interface RichTextNode {
  type: string
  text?: string
  content?: RichTextNode[]
}

function extractText(node: RichTextNode): string {
  if (node.text) return node.text
  if (node.content) return node.content.map(extractText).join('')
  return ''
}

function resolveField(value: unknown, fallback: string): string {
  if (typeof value === 'string') return value
  // Storyblok rich text: { type: 'doc', content: [...] }
  if (value && typeof value === 'object' && 'content' in value) {
    return extractText(value as RichTextNode).trim() || fallback
  }
  return fallback
}

export interface EventContent {
  evento_etiqueta: string
  evento_nombre: string
  evento_descripcion: string
  evento_fecha: string
  evento_lugar: string
  evento_duracion: string
  evento_plazas: string
}

export const FALLBACK: EventContent = {
  evento_etiqueta: 'Evento presencial · Madrid · 17.06.2026',
  evento_nombre: 'IA APLICADA EN UN SOLO DÍA',
  evento_descripcion:
    'Un encuentro presencial de Garaje Boost AI para equipos de diseño, data y tecnología. Una jornada para entender el contexto, reducir el ruido y activar la inteligencia artificial con propósito, criterio y visión de futuro.',
  evento_fecha: '17 de junio · 2026',
  evento_lugar: 'Madrid · sede por confirmar',
  evento_duracion: '18:00 — 21:00 h',
  evento_plazas: '40 — aforo limitado',
}

export async function getEventContent(): Promise<EventContent> {
  const token = process.env.STORYBLOK_TOKEN
  const slug = process.env.STORYBLOK_LOCATION ?? 'home'

  if (!token) {
    console.info('[Storyblok] No token — usando contenido por defecto')
    return FALLBACK
  }

  // En dev usamos "draft" para ver cambios sin publicar; en prod solo "published"
  const version = process.env.NODE_ENV === 'development' ? 'draft' : 'published'

  try {
    const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?version=${version}&token=${token}`
    const res = await fetch(url, {
      next: { tags: ['storyblok', `story:${slug}`] },
    })

    if (!res.ok) {
      console.warn(`[Storyblok] Fetch ${res.status} para "${slug}" — usando contenido por defecto`)
      return FALLBACK
    }

    const json = await res.json()
    const content = json?.story?.content as Record<string, unknown> | undefined

    if (!content) {
      console.warn('[Storyblok] Respuesta sin content — usando contenido por defecto')
      return FALLBACK
    }

    console.info(`[Storyblok] Contenido cargado desde CMS (${version}) — slug: ${slug}`)

    return {
      evento_etiqueta:   resolveField(content.evento_etiqueta,   FALLBACK.evento_etiqueta),
      evento_nombre:     resolveField(content.evento_nombre,     FALLBACK.evento_nombre),
      evento_descripcion: resolveField(content.evento_descripcion, FALLBACK.evento_descripcion),
      evento_fecha:      resolveField(content.evento_fecha,      FALLBACK.evento_fecha),
      evento_lugar:      resolveField(content.evento_lugar,      FALLBACK.evento_lugar),
      evento_duracion:   resolveField(content.evento_duracion,   FALLBACK.evento_duracion),
      evento_plazas:     resolveField(content.evento_plazas,     FALLBACK.evento_plazas),
    }
  } catch (err) {
    console.warn('[Storyblok] Error de red — usando contenido por defecto:', err)
    return FALLBACK
  }
}
