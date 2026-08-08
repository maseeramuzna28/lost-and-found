import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="header-logo">🎓 Campus Lost &amp; Found</span>
        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Report Item
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
