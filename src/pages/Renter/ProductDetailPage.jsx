import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import ProductRail from '../../components/ProductRail';
import ProductVisual from '../../components/ProductVisual';
import SiteFooter from '../../components/SiteFooter';
import TryOnModal from '../../components/TryOnModal';
import { addToCart } from '../../services/store';
import { getProductById, getRecommendedProducts } from '../../services/mockData';
import { formatCurrency } from '../../utils/formatters';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getProductById(productId), [productId]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return getRecommendedProducts({
      seedProduct: product,
      limit: 6,
      excludeId: product.id,
    });
  }, [product]);

  if (!product) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="container product-detail-shell py-5">
          <div className="empty-view">
            <h2 className="mb-2">Product not found.</h2>
            <button type="button" className="btn btn-primary rounded-pill" onClick={() => navigate('/products')}>
              Back to catalog
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, { size: product.size, durationKey: '4-days', quantity });
  };

  const incrementQuantity = () => setQuantity((current) => current + 1);
  const decrementQuantity = () => setQuantity((current) => Math.max(1, current - 1));

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container product-detail-shell py-5">
        <div className="row g-5 align-items-start product-detail__layout">
          <div className="col-lg-6">
            <ProductVisual token={product.imageTokens[selectedImage]} height={560} fit="contain" className="product-visual--detail" />
            {product.imageTokens.length > 1 && (
              <div className="thumbnail-row mt-3">
                {product.imageTokens.map((token, index) => (
                  <button
                    type="button"
                    key={token.id}
                    className={`thumbnail-chip ${selectedImage === index ? 'is-active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View ${product.name} image ${index + 1}`}
                  >
                    <img src={token.imageUrl} alt={token.alt} className="thumbnail-chip__image" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <p className="eyebrow mb-2">{product.brand} · {product.category}</p>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-description">{product.description}</p>

            <div className="detail-price-row">
              <div>
                <div className="detail-price">{formatCurrency(product.price)}</div>
                <div className="text-muted">Original retail {formatCurrency(product.originalPrice)}</div>
              </div>
              <div className="badge-soft">{product.badge}</div>
            </div>

            <div className="detail-meta-grid mt-4">
              <div>
                <span>Gender</span>
                <strong>{product.gender}</strong>
              </div>
              <div>
                <span>Material</span>
                <strong>{product.material}</strong>
              </div>
              <div>
                <span>Condition</span>
                <strong>{product.condition}</strong>
              </div>
              <div>
                <span>Style</span>
                <strong>{product.styleTag}</strong>
              </div>
            </div>

            <div className="mt-4">
              <span className="form-label fw-semibold d-block">Rental size</span>
              <div className="size-pill is-active size-pill--static">{product.size}</div>
            </div>

            <div className="detail-actions mt-4">
              <div>
                <span className="form-label fw-semibold d-block">Quantity</span>
                <div className="quantity-stepper quantity-stepper--detail" aria-label={`Quantity for ${product.name}`}>
                  <button type="button" className="quantity-stepper__button" onClick={decrementQuantity} aria-label={`Decrease quantity for ${product.name}`}>
                    −
                  </button>
                  <span className="quantity-stepper__value">{quantity}</span>
                  <button type="button" className="quantity-stepper__button" onClick={incrementQuantity} aria-label={`Increase quantity for ${product.name}`}>
                    +
                  </button>
                </div>
              </div>
              <div className="detail-actions__buttons">
                <button type="button" className="btn detail-action detail-action--primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <TryOnModal product={product} triggerClassName="detail-action detail-action--dark" />
              </div>
            </div>

            <div className="trust-block mt-4">
              <h3 className="h5 mb-3">Trust notes</h3>
              <ul className="rules-list mb-0">
                {product.trustNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ProductRail
            eyebrow="Recommended edit"
            title="More pieces in the same mood"
            subtitle="A tighter recommendation rail based on category, material, and styling fit."
            products={recommendedProducts}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default ProductDetailPage;
