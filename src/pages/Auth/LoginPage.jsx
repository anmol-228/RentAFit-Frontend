import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { hasLenderAccess, loginUser } from '../../services/store';
import { resolveAssetPath } from '../../utils/assetPaths';

const highlights = [
  'Move between renter orders and lender tools from one account.',
  'Keep your cart, orders, and listing workspace inside the same product.',
  'Use the demo accounts below if you want to jump straight into the flows.',
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = loginUser(formData);

    if (!user) {
      setError('Account not found. Use signup first or try the demo credentials shown below.');
      return;
    }

    const redirectTo = location.state?.redirectTo || (hasLenderAccess(user) ? '/lender/dashboard' : '/');
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="auth-page min-vh-100">
      <div className="container-xxl py-4 py-lg-5 px-3 px-lg-4">
        <div className="auth-stage">
          <section className="auth-stage__visual">
            <img src={resolveAssetPath('/hero_banners/unisex_banner.jpg')} alt="Unisex rental editorial model" className="auth-stage__image" />
            <div className="auth-stage__motion" aria-hidden="true">
              <span className="auth-stage__glow auth-stage__glow--one" />
              <span className="auth-stage__glow auth-stage__glow--two" />
              <span className="auth-stage__chip auth-stage__chip--one">One account</span>
              <span className="auth-stage__chip auth-stage__chip--two">Renter + lender</span>
            </div>
            <div className="auth-stage__content">
              <div>
                <Link to="/" className="brand-wordmark auth-stage__brand">Rent a Fit</Link>
                <p className="eyebrow auth-stage__kicker mb-2">Welcome back</p>
                <h1 className="section-title auth-stage__title mb-3">Sign in to continue renting, ordering, or managing listings.</h1>
                <p className="auth-stage__copy mb-0">One account lets you move cleanly between the storefront and the lender workspace.</p>
              </div>

              <div className="auth-stage__notes">
                <div className="auth-stage__highlights">
                  {highlights.map((item) => (
                    <div className="auth-stage__highlight" key={item}>{item}</div>
                  ))}
                </div>

                <div className="auth-stage__credential-card">
                  <p className="eyebrow mb-2">Demo accounts</p>
                  <div className="auth-stage__credential-row">
                    <span>Renter</span>
                    <strong>renter@rentafit.demo / demo123</strong>
                  </div>
                  <div className="auth-stage__credential-row">
                    <span>Lender</span>
                    <strong>lender@rentafit.demo / demo123</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="auth-stage__panel">
            <div className="auth-stage__panel-head">
              <p className="eyebrow mb-2">Account access</p>
              <h2 className="section-title mb-2">Login</h2>
              <p className="text-muted mb-0">Use an existing account or the demo credentials on the left.</p>
            </div>

            <form onSubmit={handleSubmit} className="d-grid gap-3 mt-4">
              <div>
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control form-control-lg" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control form-control-lg" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
              </div>
              {error && <div className="alert alert-danger rounded-4 py-2 mb-0">{error}</div>}
              <button type="submit" className="btn btn-primary btn-lg rounded-pill mt-2">Login</button>
            </form>

            <div className="auth-stage__panel-footer mt-4">
              <p className="mb-0 text-muted">New here? <Link to="/signup">Create an account</Link></p>
              <Link to="/" className="auth-stage__text-link">Back to home</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
