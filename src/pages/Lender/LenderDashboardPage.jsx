import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import { getLenderOrderRequests, getStoredLenderListings } from '../../services/mockData';
import { enableLenderAccess, getCurrentUser, hasLenderAccess } from '../../services/store';
import { formatCurrency } from '../../utils/formatters';

function statusClass(status) {
  if (status === 'ACTIVE') return 'status-pill status-pill--success';
  if (status === 'PENDING_REVIEW' || status === 'REAPPROVAL_REQUIRED') return 'status-pill status-pill--warning';
  return 'status-pill status-pill--danger';
}

function formatCreatedDate(value) {
  if (!value) return 'Recently added';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Recently added';
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function LenderDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState(getStoredLenderListings());
  const [user, setUser] = useState(getCurrentUser());
  const [upgradeForm, setUpgradeForm] = useState({ phone: '', city: '', reason: '', agree: false });

  useEffect(() => {
    const refresh = () => {
      setListings(getStoredLenderListings());
      setUser(getCurrentUser());
    };
    window.addEventListener('rentafit:listings-updated', refresh);
    window.addEventListener('rentafit:user-updated', refresh);
    return () => {
      window.removeEventListener('rentafit:listings-updated', refresh);
      window.removeEventListener('rentafit:user-updated', refresh);
    };
  }, []);

  useEffect(() => {
    if (user == null) {
      navigate('/login', { state: { redirectTo: '/lender/dashboard' }, replace: true });
    }
  }, [navigate, user]);

  const orderRequests = useMemo(() => getLenderOrderRequests(listings), [listings]);

  const stats = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((item) => item.status === 'ACTIVE').length;
    const pending = listings.filter((item) => item.status === 'PENDING_REVIEW' || item.status === 'REAPPROVAL_REQUIRED').length;
    const rejected = listings.filter((item) => item.status === 'REJECTED' || item.status === 'REMOVED').length;
    const projectedEarnings = listings
      .filter((item) => item.status === 'ACTIVE')
      .reduce((sum, item) => sum + item.price * 2.4, 0);
    return { total, active, pending, rejected, projectedEarnings };
  }, [listings]);

  const recentUploads = useMemo(
    () => [...listings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [listings],
  );

  const handleUpgradeChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUpgradeForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpgradeSubmit = (event) => {
    event.preventDefault();
    if (user == null || upgradeForm.agree === false) return;
    enableLenderAccess(user, upgradeForm);
  };

  if (user == null) return null;

  if (hasLenderAccess(user) === false) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
          <section className="workspace-card workspace-gate">
            <div className="workspace-card__header workspace-card__header--stacked">
              <div>
                <p className="eyebrow mb-2">Lender access</p>
                <h1 className="section-title mb-2">Open the lender workspace</h1>
                <p className="text-muted mb-0">Confirm your details before unlocking listing uploads, pricing guidance, and moderation tracking.</p>
              </div>
            </div>

            <form className="row g-3" onSubmit={handleUpgradeSubmit}>
              <div className="col-md-6">
                <label className="form-label">Phone number</label>
                <input type="tel" name="phone" className="form-control form-control-lg" value={upgradeForm.phone} onChange={handleUpgradeChange} placeholder="Enter contact number" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-control form-control-lg" value={upgradeForm.city} onChange={handleUpgradeChange} placeholder="Current city" required />
              </div>
              <div className="col-12">
                <label className="form-label">Why do you want lender access?</label>
                <textarea name="reason" className="form-control" rows="4" value={upgradeForm.reason} onChange={handleUpgradeChange} placeholder="Mention the kind of pieces you want to upload." required />
              </div>
              <div className="col-12">
                <label className="form-check d-flex gap-2 align-items-start">
                  <input className="form-check-input mt-1" type="checkbox" name="agree" checked={upgradeForm.agree} onChange={handleUpgradeChange} />
                  <span className="form-check-label text-muted">I confirm that I want to unlock lender access and open the dashboard.</span>
                </label>
              </div>
              <div className="col-12 d-flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={upgradeForm.agree === false}>Continue to lender dashboard</button>
                <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/')}>
                  Go back home
                </button>
              </div>
            </form>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
        {location.state?.listed ? (
          <div className="alert alert-success rounded-4 border-0 shadow-sm">Listing saved to your dashboard with a front-view cover image and close-up detail image.</div>
        ) : null}

        <section className="workspace-header workspace-header--lender">
          <div>
            <p className="eyebrow mb-2">Lender workspace</p>
            <h1 className="section-title mb-2">Welcome back, {user.name || 'Lender'}.</h1>
            <p className="text-muted mb-0">Monitor uploads, moderation state, and incoming demand from one cleaner workspace. Every new listing now starts with one clean front view and one close-up detail shot.</p>
          </div>
          <div className="workspace-header__actions">
            <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/products')}>
              View catalog
            </button>
            <button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/lender/upload')}>
              Upload product
            </button>
          </div>
        </section>

        <section className="workspace-kpi-strip mb-4">
          <div className="metric-card"><span>Total listings</span><strong>{stats.total}</strong></div>
          <div className="metric-card"><span>Active</span><strong>{stats.active}</strong></div>
          <div className="metric-card"><span>Pending</span><strong>{stats.pending}</strong></div>
          <div className="metric-card"><span>Rejected</span><strong>{stats.rejected}</strong></div>
          <div className="metric-card"><span>Order requests</span><strong>{orderRequests.length}</strong></div>
          <div className="metric-card"><span>Projected monthly</span><strong>{formatCurrency(stats.projectedEarnings)}</strong></div>
        </section>

        <section className="workspace-card lender-guidance-card mb-4">
          <div className="workspace-card__header workspace-card__header--stacked">
            <div>
              <p className="eyebrow mb-1">Upload standard</p>
              <h2 className="h4 mb-0">Two images, with clear roles across the product journey.</h2>
            </div>
          </div>
          <div className="lender-guidance-card__grid">
            <div className="lender-guidance-card__item">
              <span>01</span>
              <strong>Clean front view</strong>
              <p>Becomes the cover image renters first see in catalog and search.</p>
            </div>
            <div className="lender-guidance-card__item">
              <span>02</span>
              <strong>Close-up detail</strong>
              <p>Supports the product page with texture, finish, and garment detail.</p>
            </div>
            <div className="lender-guidance-card__item">
              <span>03</span>
              <strong>Same review path</strong>
              <p>Both images stay attached to pricing, moderation, and saved listing previews.</p>
            </div>
          </div>
        </section>

        <div className="workspace-grid mb-4">
          <section className="workspace-card">
            <div className="workspace-card__header">
              <div>
                <p className="eyebrow mb-1">Recent uploads</p>
                <h2 className="h4 mb-0">Latest listing activity</h2>
              </div>
            </div>

            {recentUploads.length === 0 ? (
              <div className="empty-view py-4">
                <h3 className="mb-2">No uploads yet.</h3>
                <p className="text-muted mb-0">Your latest uploads will start showing here after the first submission with one front view and one close-up detail shot.</p>
              </div>
            ) : (
              <div className="workspace-list">
                {recentUploads.map((listing) => (
                  <div key={listing.id} className="workspace-list__item">
                    <div className="workspace-list__media">
                      <div className="workspace-list__thumbs">
                        {[listing.mainImageUrl, listing.imageUrls?.[1]].filter(Boolean).slice(0, 2).map((imageUrl, imageIndex) => (
                          <div key={`${listing.id}-preview-${imageIndex + 1}`} className="workspace-list__thumb-frame">
                            <img src={imageUrl} alt={`${listing.name} preview ${imageIndex + 1}`} className="workspace-list__thumb" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="fw-semibold">{listing.name}</div>
                        <div className="text-muted small">{listing.brand} • {listing.category}</div>
                        <div className="text-muted small">Front view cover + close-up detail saved</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{formatCurrency(listing.price)}</div>
                      <span className={statusClass(listing.status)}>{listing.status.replaceAll('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="workspace-card">
            <div className="workspace-card__header">
              <div>
                <p className="eyebrow mb-1">Order requests</p>
                <h2 className="h4 mb-0">Incoming demand</h2>
              </div>
            </div>

            {orderRequests.length === 0 ? (
              <div className="empty-view py-4">
                <h3 className="mb-2">No order requests yet.</h3>
                <p className="text-muted mb-0">Order requests will appear here once active listings start receiving renter interest.</p>
              </div>
            ) : (
              <div className="workspace-list">
                {orderRequests.map((request) => (
                  <div key={request.id} className="workspace-list__item">
                    <div>
                      <div className="fw-semibold">{request.productName}</div>
                      <div className="text-muted small">{request.customerName} • {request.durationLabel} • Size {request.size}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{formatCurrency(request.value)}</div>
                      <span className="status-pill status-pill--warning">{request.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="workspace-card">
          <div className="workspace-card__header workspace-card__header--stacked">
            <div>
              <p className="eyebrow mb-1">Your uploaded items</p>
              <h2 className="h4 mb-0">Listing queue</h2>
              <p className="text-muted mb-0">Each card shows the same front-view cover and close-up detail structure renters will see later in the product experience.</p>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="empty-view">
              <h3 className="mb-2">No uploaded items yet.</h3>
              <p className="text-muted mb-3">Start with one product upload using a clean front view and one close-up detail shot to preview the full lender journey.</p>
              <button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/lender/upload')}>
                Upload first item
              </button>
            </div>
          ) : (
            <div className="lender-listing-grid">
              {listings.map((listing) => (
                <article key={listing.id} className="lender-listing-card">
                  <div className="lender-listing-card__visuals">
                    <div className="lender-listing-card__primary-frame">
                      {listing.mainImageUrl ? (
                        <img src={listing.mainImageUrl} alt={`${listing.name} front view`} className="lender-listing-card__primary-img" />
                      ) : (
                        <div className="upload-preview-card__empty">Front view unavailable</div>
                      )}
                    </div>
                    <div className="lender-listing-card__detail-frame">
                      {listing.imageUrls?.[1] ? (
                        <img src={listing.imageUrls[1]} alt={`${listing.name} close-up`} className="lender-listing-card__detail-img" />
                      ) : (
                        <div className="upload-preview-card__empty">Close-up unavailable</div>
                      )}
                    </div>
                  </div>

                  <div className="lender-listing-card__body">
                    <div className="lender-listing-card__top">
                      <div>
                        <p className="eyebrow mb-1">{listing.brand} • {listing.category}</p>
                        <h3>{listing.name}</h3>
                      </div>
                      <span className={statusClass(listing.status)}>{listing.status.replaceAll('_', ' ')}</span>
                    </div>

                    <div className="lender-listing-card__meta">
                      <div className="lender-listing-card__meta-item"><span>Selected price</span><strong>{formatCurrency(listing.price)}</strong></div>
                      <div className="lender-listing-card__meta-item"><span>Decision</span><strong>{listing.decisionLabel || 'Review'}</strong></div>
                      <div className="lender-listing-card__meta-item"><span>Image set</span><strong>Front + close-up</strong></div>
                      <div className="lender-listing-card__meta-item"><span>Uploaded</span><strong>{formatCreatedDate(listing.createdAt)}</strong></div>
                    </div>

                    <div className="lender-listing-card__footer">
                      <div>
                        <div className="fw-semibold">Primary front view · secondary close-up</div>
                        <div className="text-muted small">Saved renter-facing preview structure is already attached to this listing.</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default LenderDashboardPage;
