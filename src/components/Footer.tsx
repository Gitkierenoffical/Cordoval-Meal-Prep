export function Footer() {
  return (
    <footer className="app-footer">
      <p className="footer-brand">Cordoval software</p>
      <p className="footer-note">
        Your meals and lists stay in this browser. No accounts, no cloud sync.
      </p>
      <nav className="footer-nav" aria-label="Legal">
        <a href="https://scrub.cordoval.co.uk/privacy" rel="noopener noreferrer">
          Privacy
        </a>
        <span className="footer-sep" aria-hidden="true">·</span>
        <a href="https://scrub.cordoval.co.uk/terms" rel="noopener noreferrer">
          Terms
        </a>
      </nav>
    </footer>
  )
}
