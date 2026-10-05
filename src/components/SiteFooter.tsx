export default function SiteFooter() {
  return (
    <footer
      style={{
        background: 'var(--surface-inverse)',
        color: 'var(--text-inverse-quiet)',
        padding: '32px 0',
        borderTop: '1px solid var(--scrim-paper-08)',
      }}
    >
      <div
        className="page-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          letterSpacing: '0.01em',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span>© 2026 Garaje de Ideas · European Digital Group</span>
        <span style={{ display: 'inline-flex', gap: 24 }}>
          <a
            href="#"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color var(--dur-quick) var(--ease-out)',
            }}
          >
            Política de privacidad
          </a>
          <a
            href="#"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color var(--dur-quick) var(--ease-out)',
            }}
          >
            Aviso legal
          </a>
        </span>
      </div>
    </footer>
  )
}
