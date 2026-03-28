import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import { clearCurrentUser, getCartCount, getCurrentUser, hasLenderAccess } from '../services/store';

const THEME_STORAGE_KEY = 'rentafit-theme-preference';

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light';
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return 'light';
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 .98.8h8.84a1 1 0 0 0 .98-.8L21 7H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 19c1.4-3 4-4.5 6.5-4.5s5.1 1.5 6.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.5v2.3M12 19.2v2.3M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AccountMenu({ navigate, user, profileLabel, handleLogout, compact = false }) {
  return (
    <div className="dropdown">
      <button
        className={'icon-chip dropdown-toggle profile-chip' + (compact ? ' icon-chip--compact profile-chip--compact' : '')}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <ProfileIcon />
        {!compact && <span className="d-none d-md-inline">{profileLabel}</span>}
      </button>
      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-4 p-2">
        {user ? (
          <>
            <li><span className="dropdown-item-text fw-semibold">{user.name}</span></li>
            <li><button type="button" className="dropdown-item rounded-3" onClick={() => navigate('/orders')}>Orders</button></li>
            <li><button type="button" className="dropdown-item rounded-3" onClick={() => navigate('/cart')}>Cart</button></li>
            <li>
              <button type="button" className="dropdown-item rounded-3" onClick={() => navigate('/lender/dashboard')}>
                {hasLenderAccess(user) ? 'Lender dashboard' : 'Become a lender'}
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><button type="button" className="dropdown-item rounded-3" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><button type="button" className="dropdown-item rounded-3" onClick={() => navigate('/login')}>Login</button></li>
            <li><button type="button" className="dropdown-item rounded-3" onClick={() => navigate('/signup')}>Signup</button></li>
          </>
        )}
      </ul>
    </div>
  );
}

function AppNavbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [user, setUser] = useState(getCurrentUser());
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    const refresh = () => {
      setCartCount(getCartCount());
      setUser(getCurrentUser());
    };
    window.addEventListener('rentafit:cart-updated', refresh);
    window.addEventListener('rentafit:user-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('rentafit:cart-updated', refresh);
      window.removeEventListener('rentafit:user-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    const syncScroll = () => setIsScrolled(window.scrollY > 18);
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const profileLabel = useMemo(() => user?.name?.split(' ')[0] || 'Account', [user]);

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  const handleLenderClick = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/lender/dashboard' } });
      return;
    }
    navigate('/lender/dashboard');
  };

  return (
    <>
      <nav className={'navbar navbar-expand-xl app-navbar sticky-top' + (isScrolled ? ' app-navbar--scrolled' : '')}>
        <div className="container-xxl px-3 px-lg-4 app-navbar__shell">
          <NavLink to="/" className="navbar-brand app-navbar__brand">
            <span className="brand-wordmark">Rent a Fit</span>
            <span className="app-navbar__tag">Rotate the wardrobe, keep the look.</span>
          </NavLink>

          <div className="app-navbar__quick-actions d-xl-none">
            <button type="button" className="icon-chip icon-chip--compact" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Open search">
              <SearchIcon />
            </button>

            <button type="button" className="icon-chip icon-chip--compact position-relative" onClick={() => navigate('/cart')} aria-label="Go to cart">
              <CartIcon />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <AccountMenu navigate={navigate} user={user} profileLabel={profileLabel} handleLogout={handleLogout} compact />

            <button
              className="navbar-toggler app-navbar__toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto gap-xl-2 mt-3 mt-xl-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link app-nav-link">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/products" className="nav-link app-nav-link">Rent</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/faq" className="nav-link app-nav-link">FAQ</NavLink>
              </li>
            </ul>

            <div className="d-none d-xl-flex align-items-center gap-2 gap-lg-3 mt-3 mt-xl-0 app-navbar__actions">
              <button type="button" className="icon-chip" data-bs-toggle="modal" data-bs-target="#searchModal" aria-label="Open search">
                <SearchIcon />
                <span className="d-none d-md-inline">Search</span>
              </button>

              <button
                type="button"
                className="icon-chip theme-chip"
                aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              >
                <ThemeIcon theme={theme} />
                <span className="d-none d-md-inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <button type="button" className="icon-chip position-relative" onClick={() => navigate('/cart')} aria-label="Go to cart">
                <CartIcon />
                <span className="d-none d-md-inline">Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <button type="button" className="btn btn-primary rounded-pill px-4 app-nav-cta" onClick={handleLenderClick}>
                Lender Space
              </button>

              <AccountMenu navigate={navigate} user={user} profileLabel={profileLabel} handleLogout={handleLogout} />
            </div>

            <div className="app-navbar__mobile-panel d-xl-none">
              <div className="app-navbar__mobile-panel-row">
                <button
                  type="button"
                  className="icon-chip"
                  aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}
                  onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                >
                  <ThemeIcon theme={theme} />
                  <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                </button>

                <button type="button" className="btn btn-primary rounded-pill px-4 app-nav-cta" onClick={handleLenderClick}>
                  Lender Space
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <SearchModal />
    </>
  );
}

export default AppNavbar;
