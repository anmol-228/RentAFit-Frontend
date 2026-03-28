import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import ProductRail from '../../components/ProductRail';
import ProductVisual from '../../components/ProductVisual';
import SiteFooter from '../../components/SiteFooter';
import {
  getProductById,
  getRecommendedProducts,
  getTrendingProducts,
} from '../../services/mockData';
import {
  getCartItems,
  getCurrentUser,
  removeCartItem,
  updateCartQuantity,
} from '../../services/store';
import { formatCurrency } from '../../utils/formatters';

const MIN_DURATION_DAYS = 3;
const BASE_DURATION_COST = 300;
const EXTRA_DAY_COST = 100;

const cartAssurances = [
  'Reviewed listings with pricing guidance already applied.',
  'Flexible rental duration starting from three days.',
  'The demo order flow continues into the orders screen.',
];

function getDurationDays(quantity) {
  return Math.max(MIN_DURATION_DAYS, Number(quantity) || MIN_DURATION_DAYS);
}

function getDurationCost(durationDays) {
  return BASE_DURATION_COST + Math.max(0, durationDays - MIN_DURATION_DAYS) * EXTRA_DAY_COST;
}

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(getCartItems());
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const refresh = () => {
      setCartItems(getCartItems());
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

  const itemsWithProducts = useMemo(() => {
    return cartItems.map((item) => {
      const product = getProductById(item.productId);
      const durationDays = getDurationDays(item.quantity);
      const durationCost = getDurationCost(durationDays);
      const lineTotal = item.price + durationCost;
      return { ...item, product, durationDays, durationCost, lineTotal };
    });
  }, [cartItems]);

  const summary = useMemo(() => {
    const rentPrice = itemsWithProducts.reduce((sum, item) => sum + item.price, 0);
    const durationCost = itemsWithProducts.reduce((sum, item) => sum + item.durationCost, 0);
    const total = itemsWithProducts.reduce((sum, item) => sum + item.lineTotal, 0);
    return { rentPrice, durationCost, total };
  }, [itemsWithProducts]);

  const recommendedProducts = useMemo(() => {
    const seedProduct = itemsWithProducts[0]?.product;
    if (seedProduct) {
      return getRecommendedProducts({
        seedProduct,
        limit: 6,
        excludeId: seedProduct.id,
      });
    }
    return getTrendingProducts(6);
  }, [itemsWithProducts]);

  const itemCount = itemsWithProducts.length;
  const primaryActionLabel = user ? 'Place rental request' : 'Sign in to place request';
  const mobileActionLabel = user ? 'Place request' : 'Sign in to continue';
  const summaryHelper = user
    ? 'Confirmed demo requests continue into the orders screen.'
    : 'Sign in first and we will take you straight into the orders flow.';

  const handleProceed = () => {
    if (!itemCount) {
      navigate('/products');
      return;
    }

    if (!user) {
      navigate('/login', { state: { redirectTo: '/orders' } });
      return;
    }

    navigate('/orders');
  };

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="container-xxl py-4 py-lg-5 px-3 px-lg-4 cart-page">
        <section className="cart-page__hero">
          <div>
            <p className="eyebrow mb-2">Rental bag</p>
            <h1 className="section-title mb-2">Review your pieces before you place the request.</h1>
            <p className="text-muted cart-page__hero-copy mb-0">
              Adjust duration, check the live total, and move forward without losing the calmer storefront feel.
            </p>
          </div>
          <div className="result-pill cart-page__hero-pill">
            {itemCount} piece{itemCount === 1 ? '' : 's'} selected · {formatCurrency(summary.total)}
          </div>
        </section>

        {itemCount === 0 ? (
          <div className="empty-view mb-5">
            <h2 className="mb-2">Your cart is empty.</h2>
            <p className="text-muted mb-3">
              Start with the catalog, open a few product pages, and build the rental combination from there.
            </p>
            <Link className="btn btn-primary rounded-pill px-4" to="/products">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="row g-4 align-items-start cart-page__layout">
            <div className="col-xl-8 col-lg-7 cart-page__items">
              <div className="cart-page__bag-head">
                <div className="cart-page__bag-count">
                  <span className="cart-page__bag-check" aria-hidden="true">✓</span>
                  <span>{itemCount}/{itemCount} pieces selected</span>
                  <strong>{formatCurrency(summary.total)}</strong>
                </div>
                <span className="cart-page__bag-note">Adjust duration or remove pieces before placing the request.</span>
              </div>

              <div className="d-grid gap-3">
                {itemsWithProducts.map((item) => (
                  <article className="cart-card cart-card--refined" key={item.lineId}>
                    <div className="cart-card__visual">
                      <ProductVisual token={item.imageToken} height={230} small />
                    </div>

                    <div className="cart-card__content">
                      <div className="cart-card__header">
                        <div>
                          <p className="eyebrow mb-2">{item.brand} · {item.category}</p>
                          <h2 className="cart-card__title mb-2">{item.name}</h2>
                          <div className="cart-card__meta-row">
                            <span className="badge-soft">Size {item.size}</span>
                            <span className="badge-soft">{item.durationDays} day rental</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => removeCartItem(item.lineId)}
                          aria-label={'Remove ' + item.name + ' from cart'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 3.75h6m-9 3h12m-1.5 0-.526 10.017A2.25 2.25 0 0 1 13.728 19H10.27a2.25 2.25 0 0 1-2.246-2.233L7.5 6.75m3 3.75v4.5m3-4.5v4.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>

                      <p className="cart-card__description mb-0">
                        Minimum rental duration starts at three days. Extend the duration here and the pricing updates instantly.
                      </p>

                      <div className="cart-card__controls">
                        <div className="cart-card__field cart-card__field--duration">
                          <span className="form-label d-block mb-2">Rental duration</span>
                          <div className="quantity-stepper quantity-stepper--duration" aria-label={'Duration for ' + item.name}>
                            <button
                              type="button"
                              className="quantity-stepper__button"
                              onClick={() => updateCartQuantity(item.lineId, Math.max(MIN_DURATION_DAYS, item.durationDays - 1))}
                              aria-label={'Decrease duration for ' + item.name}
                            >
                              -
                            </button>
                            <span className="quantity-stepper__value">{item.durationDays} Days</span>
                            <button
                              type="button"
                              className="quantity-stepper__button"
                              onClick={() => updateCartQuantity(item.lineId, item.durationDays + 1)}
                              aria-label={'Increase duration for ' + item.name}
                            >
                              +
                            </button>
                          </div>
                          <span className="cart-card__helper">Base duration covers the first 3 days. Each extra day adds {formatCurrency(EXTRA_DAY_COST)}.</span>
                        </div>

                        <div className="cart-card__pricing">
                          <div className="cart-card__price-block">
                            <span>Base rent</span>
                            <strong>{formatCurrency(item.price)}</strong>
                          </div>
                          <div className="cart-card__price-block">
                            <span>Duration</span>
                            <strong>{formatCurrency(item.durationCost)}</strong>
                          </div>
                          <div className="cart-card__price-block cart-card__price-block--total">
                            <span>Line total</span>
                            <strong>{formatCurrency(item.lineTotal)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-xl-4 col-lg-5 cart-page__summary">
              <aside className="billing-card cart-summary">
                <p className="eyebrow mb-2">Order summary</p>
                <h2 className="h4 mb-2">Ready to place the rental request?</h2>
                <p className="text-muted cart-summary__copy mb-0">
                  Review the total, then continue into the demo order flow from here.
                </p>

                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Selected pieces</span>
                    <strong>{itemCount}</strong>
                  </div>
                  <div className="cart-summary__row">
                    <span>Base rent</span>
                    <strong>{formatCurrency(summary.rentPrice)}</strong>
                  </div>
                  <div className="cart-summary__row">
                    <span>Duration charges</span>
                    <strong>{formatCurrency(summary.durationCost)}</strong>
                  </div>
                  <div className="cart-summary__row cart-summary__row--total">
                    <span>Total</span>
                    <strong className="billing-total">{formatCurrency(summary.total)}</strong>
                  </div>
                </div>

                <div className="cart-summary__assurance">
                  {cartAssurances.map((item) => (
                    <div className="cart-summary__assurance-item" key={item}>{item}</div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg rounded-pill w-100 mt-4"
                  onClick={handleProceed}
                >
                  {primaryActionLabel}
                </button>
                <p className="cart-summary__helper mb-0 mt-3">{summaryHelper}</p>

                <Link className="btn btn-outline-primary rounded-pill w-100 mt-3" to="/products">
                  Continue browsing
                </Link>
              </aside>
            </div>
          </div>
        )}

        <div className="mt-5 pt-2">
          <ProductRail
            eyebrow="You may want one more piece"
            title="Related styles that still fit the same rental rhythm"
            subtitle="Keep browsing from the same calmer card system without losing your place in the bag."
            products={recommendedProducts}
          />
        </div>
      </main>

      {itemCount > 0 && (
        <div className="cart-mobile-checkout">
          <div className="cart-mobile-checkout__summary">
            <span>{itemCount} piece{itemCount === 1 ? '' : 's'}</span>
            <strong>{formatCurrency(summary.total)}</strong>
          </div>
          <button type="button" className="cart-mobile-checkout__button" onClick={handleProceed}>
            {mobileActionLabel}
          </button>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default CartPage;
