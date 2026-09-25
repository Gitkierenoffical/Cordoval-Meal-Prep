export function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img
          src="/meal-prep.svg"
          alt=""
          className="header-logo"
          width={40}
          height={40}
        />
        <div>
          <h1 className="header-title">Cordoval Meal Prep</h1>
          <p className="header-tagline">Plan your week. Shop once.</p>
        </div>
      </div>
    </header>
  )
}
