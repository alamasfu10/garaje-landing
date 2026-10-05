import type { EventContent } from '@/lib/storyblok'

interface Props {
  event: EventContent
}

export default function HeroSection({ event }: Props) {
  const metaItems = [
    { label: 'Fecha', value: event.evento_fecha },
    { label: 'Lugar', value: event.evento_lugar },
    { label: 'Duración', value: event.evento_duracion },
    { label: 'Plazas', value: event.evento_plazas },
  ]

  return (
    <section style={{ position: 'relative', padding: '56px 0 96px', overflow: 'hidden' }}>

      {/* Decorative sage rectangle with dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 88,
          left: '6%',
          width: 120,
          height: 144,
          background: 'var(--accent-sage)',
          borderRadius: 'var(--radius-lg)',
          zIndex: 0,
        }}
      >
        <svg viewBox="0 0 100 120" width="100%" height="100%" style={{ display: 'block' }}>
          <g fill="var(--neutral-ink)" opacity="0.32">
            {[28, 50, 72, 94].flatMap((cy) =>
              [20, 40, 60, 80].map((cx) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
              ))
            )}
          </g>
        </svg>
      </div>

      {/* Hero content */}
      <div
        className="page-content"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 36,
        }}
      >
        {/* Event pill */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            background: 'var(--surface-pill)',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-strong)',
            letterSpacing: '0.01em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: 'var(--status-live)',
              flexShrink: 0,
            }}
          />
          {event.evento_etiqueta}
        </span>

        {/* Main title */}
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(56px, 9vw, 132px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'var(--text-strong)',
            maxWidth: '14ch',
          }}
        >
          {event.evento_nombre}
        </h1>

        {/* Description */}
        <p
          style={{
            margin: 0,
            maxWidth: '60ch',
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            lineHeight: 1.55,
            color: 'var(--text-quiet)',
          }}
        >
          {event.evento_descripcion}
        </p>

        {/* CTA */}
        <a
          href="#formulario"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 28px',
            background: 'var(--action-primary-bg)',
            color: 'var(--action-primary-fg)',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            lineHeight: 1,
            textDecoration: 'none',
            transition:
              'transform var(--dur-base) var(--ease-out), opacity var(--dur-quick) var(--ease-out)',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
          <span>Reservar plaza</span>
        </a>
      </div>

      {/* Meta row */}
      <div className="page-content" style={{ position: 'relative', zIndex: 1, marginTop: 96 }}>
        <div
          className="hero-meta-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid var(--border-hairline)',
            borderBottom: '1px solid var(--border-hairline)',
          }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              className={`hero-meta-cell hero-meta-cell--${i}`}
              style={{
                padding: '28px 28px',
                borderLeft: i === 0 ? 'none' : '1px solid var(--border-hairline)',
                paddingLeft: i === 0 ? 0 : undefined,
                paddingRight: i === metaItems.length - 1 ? 0 : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-quiet)',
                  marginBottom: 10,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-strong)',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .hero-meta-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-meta-cell {
            border-left: none !important;
            padding-left: 0 !important;
          }
          .hero-meta-cell--1,
          .hero-meta-cell--3 {
            border-left: 1px solid var(--border-hairline) !important;
            padding-left: 28px !important;
          }
          .hero-meta-cell--2,
          .hero-meta-cell--3 {
            border-top: 1px solid var(--border-hairline);
            margin-top: -1px;
          }
        }
      `}</style>
    </section>
  )
}
