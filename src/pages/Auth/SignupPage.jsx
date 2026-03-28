import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerAccount } from '../../services/store';
import { resolveAssetPath } from '../../utils/assetPaths';

const starterNotes = [
  'Create a renter account to browse, save, and order pieces.',
  'Start as a lender if you want direct access to listing uploads and pricing guidance.',
  'You can expand the account later without creating a separate profile.',
];

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    primaryRole: 'renter',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = registerAccount(formData);
    const redirectTo = location.state?.redirectTo || (user.primaryRole === 'lender' ? '/lender/dashboard' : '/');
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="auth-page min-vh-100">
      <div className="container-xxl py-4 py-lg-5 px-3 px-lg-4">
        <div className="auth-stage">
          <section className="auth-stage__visual auth-stage__visual--shared">
            <img src={resolveAssetPath('/hero_banners/unisex_banner.jpg')} alt="Shared wardrobe editorial" className="auth-stage__image" />
            <div className="auth-stage__veil" aria-hidden="true" />
            <div className="auth-stage__orb auth-stage__orb--one" aria-hidden="true" />
            <div className="auth-stage__orb auth-stage__orb--two" aria-hidden="true" />

            <div className="auth-stage__content">
              <div>
                <Link to="/" className="brand-wordmark auth-stage__brand">Rent a Fit</Link>
                <p className="eyebrow auth-stage__kicker mb-2">Create account</p>
                <h1 className="section-title auth-stage__title mb-3">Create one account for both sides of the wardrobe.</h1>
                <p className="auth-stage__copy mb-0">Start with the role that fits today, then move between renter and lender journeys without splitting the experience.</p>
              </div>

              <div className="auth-stage__notes">
                <div className="auth-stage__highlights">
                  {starterNotes.map((item) => (
                    <div className="auth-stage__highlight" key={item}>{item}</div>
                  ))}
                </div>

                <div className="auth-stage__credential-card auth-stage__credential-card--compact">
                  <p className="eyebrow mb-2">How the account works</p>
                  <div className="auth-stage__credential-row auth-stage__credential-row--stacked">
                    <span>Renter mode</span>
                    <strong>Browse, save, and place rental requests.</strong>
                  </div>
                  <div className="auth-stage__credential-row auth-stage__credential-row--stacked">
                    <span>Lender mode</span>
                    <strong>Upload, price, review, and manage listings.</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="auth-stage__panel">
            <div className="auth-stage__panel-head">
              <p className="eyebrow mb-2">Start here</p>
              <h2 className="section-title mb-2">Create account</h2>
              <p className="text-muted mb-0">Choose your starting role and we will route you into the right workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="row g-3 mt-1">
              <div className="col-12">
                <label className="form-label">Full name</label>
                <input type="text" name="name" className="form-control form-control-lg" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control form-control-lg" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control form-control-lg" placeholder="Create password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">Primary role</label>
                <div className="role-toggle" role="tablist" aria-label="Choose primary role">
                  {[
                    { value: 'renter', label: 'Renter', copy: 'Browse, save, and order.' },
                    { value: 'lender', label: 'Lender', copy: 'Upload and manage listings.' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      className={`role-toggle__button ${formData.primaryRole === role.value ? 'is-active' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, primaryRole: role.value }))}
                    >
                      <strong>{role.label}</strong>
                      <span>{role.copy}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill mt-2">Create account</button>
              </div>
            </form>

            <div className="auth-stage__panel-footer mt-4">
              <p className="mb-0 text-muted">Already have an account? <Link to="/login">Login</Link></p>
              <Link to="/" className="auth-stage__text-link">Back to home</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
