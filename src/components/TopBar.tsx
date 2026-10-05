export default function TopBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-hairline)',
      }}
    >
      <div
        className="page-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Wordmark */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 17,
            letterSpacing: '-0.02em',
            color: 'var(--text-strong)',
            lineHeight: 1,
          }}
        >
          <span>GARAJE</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.04em',
              marginLeft: 4,
              color: 'var(--text-quiet)',
            }}
          >
            BOOST
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginLeft: 2,
              verticalAlign: 'super',
              color: 'var(--text-quiet)',
            }}
          >
            AI
          </span>
        </a>

        {/* CTA */}
        <a
          href="#formulario"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            background: 'var(--action-primary-bg)',
            color: 'var(--action-primary-fg)',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            lineHeight: 1,
            textDecoration: 'none',
            transition:
              'opacity var(--dur-quick) var(--ease-out)',
          }}
        >
          Reservar plaza
        </a>
      </div>
    </header>
  )
}
