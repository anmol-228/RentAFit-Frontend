import { Link } from 'react-router-dom';
import ProductVisual from './ProductVisual';
import { formatCurrency } from '../utils/formatters';

function ProductCard({ product, compact = false }) {
  return (
    <article className={`product-card ${compact ? 'product-card--compact' : ''}`}>
      <Link to={`/products/${product.id}`} className="product-card__visual-link" aria-label={`Open ${product.name}`}>
        <ProductVisual token={product.imageTokens?.[0]} height={compact ? 220 : 320} small={compact} />
      </Link>

      <div className="product-card__body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="product-card__meta mb-1">{product.brand} · {product.category}</p>
            <h3 className="product-card__title mb-0">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h3>
          </div>
          {product.badge && <span className="badge-soft">{product.badge}</span>}
        </div>

        <p className="product-card__description mb-0">{product.shortDescription}</p>

        <div className="product-card__footer">
          <div>
            <div className="product-card__price">{formatCurrency(product.price)}</div>
            <div className="product-card__subtext">Size {product.size} · {product.gender}</div>
          </div>
          <Link to={`/products/${product.id}`} className="product-card__cta">
            View piece
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
