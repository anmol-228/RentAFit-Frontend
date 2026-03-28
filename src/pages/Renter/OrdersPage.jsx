import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import { getUserOrders } from '../../services/mockData';
import { getCurrentUser } from '../../services/store';
import { formatCurrency } from '../../utils/formatters';

function orderStatusClass(status) {
  if (status === 'ACTIVE_RENTAL' || status === 'OUT_FOR_DELIVERY') return 'status-pill status-pill--success';
  if (status === 'CONFIRMED' || status === 'RETURN_REQUESTED') return 'status-pill status-pill--warning';
  return 'status-pill status-pill--danger';
}

function OrdersPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const orders = useMemo(() => getUserOrders(), []);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/orders' }, replace: true });
    }
  }, [navigate, user]);

  const currentOrders = orders.filter((order) => !['RETURNED', 'COMPLETED', 'CANCELLED'].includes(order.status));
  const pastOrders = orders.filter((order) => ['RETURNED', 'COMPLETED', 'CANCELLED'].includes(order.status));

  if (!user) return null;

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl py-5 px-3 px-lg-4">
        <section className="listing-header mb-4">
          <p className="eyebrow mb-2">Orders</p>
          <div>
            <h1 className="section-title mb-1">Track your rentals</h1>
            <p className="text-muted mb-0">Current and past orders stay together here, with tracking details shown inside each order card.</p>
          </div>
        </section>

        <section className="dashboard-panel mb-4">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
            <div>
              <p className="eyebrow mb-1">Current</p>
              <h2 className="h4 mb-0">Live order tracking</h2>
            </div>
          </div>

          {currentOrders.length === 0 ? (
            <div className="empty-view py-4">
              <h3 className="mb-2">No active rentals right now.</h3>
              <p className="text-muted mb-0">Once you place an order, the tracking stages will appear here.</p>
            </div>
          ) : (
            <div className="orders-stack">
              {currentOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card__header">
                    <div>
                      <p className="mb-1 fw-semibold">{order.productName}</p>
                      <p className="text-muted small mb-0">Order ID: {order.id} • {order.durationLabel}</p>
                    </div>
                    <span className={orderStatusClass(order.status)}>{order.status.replaceAll('_', ' ')}</span>
                  </div>
                  <div className="order-card__meta">
                    <div><span>Rental window</span><strong>{order.rentalWindow}</strong></div>
                    <div><span>Selected size</span><strong>{order.size}</strong></div>
                    <div><span>Total</span><strong>{formatCurrency(order.total)}</strong></div>
                  </div>
                  <div className="order-timeline">
                    {order.timeline.map((step) => (
                      <div key={step.label} className={`order-timeline__step ${step.complete ? 'is-complete' : ''}`}>
                        <span className="order-timeline__dot" />
                        <div>
                          <strong>{step.label}</strong>
                          <p className="mb-0 text-muted small">{step.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
            <div>
              <p className="eyebrow mb-1">History</p>
              <h2 className="h4 mb-0">Past orders</h2>
            </div>
          </div>

          {pastOrders.length === 0 ? (
            <div className="empty-view py-4">
              <h3 className="mb-2">No completed rentals yet.</h3>
              <p className="text-muted mb-0">Completed and returned orders will be collected here.</p>
            </div>
          ) : (
            <div className="orders-stack">
              {pastOrders.map((order) => (
                <article key={order.id} className="order-card order-card--past">
                  <div className="order-card__header">
                    <div>
                      <p className="mb-1 fw-semibold">{order.productName}</p>
                      <p className="text-muted small mb-0">Order ID: {order.id} • {order.durationLabel}</p>
                    </div>
                    <span className={orderStatusClass(order.status)}>{order.status.replaceAll('_', ' ')}</span>
                  </div>
                  <div className="order-card__meta">
                    <div><span>Rental window</span><strong>{order.rentalWindow}</strong></div>
                    <div><span>Selected size</span><strong>{order.size}</strong></div>
                    <div><span>Total</span><strong>{formatCurrency(order.total)}</strong></div>
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

export default OrdersPage;
