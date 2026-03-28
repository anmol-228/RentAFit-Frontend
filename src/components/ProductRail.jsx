import ProductCard from './ProductCard';
import Reveal from './Reveal';

function ProductRail({ title, subtitle, products, eyebrow = 'Curated Rail' }) {
  if (!products?.length) return null;

  return (
    <section className="section-shell rail-shell">
      <Reveal className="section-heading d-flex justify-content-between align-items-end gap-3 mb-3" as="div">
        <div>
          <p className="eyebrow mb-1">{eyebrow}</p>
          <h2 className="section-title mb-0">{title}</h2>
        </div>
        {subtitle && <p className="text-muted mb-0 section-subtitle">{subtitle}</p>}
      </Reveal>

      <div className="product-rail">
        {products.map((product, index) => (
          <Reveal className="product-rail__item" key={product.id} delay={index * 90}>
            <ProductCard product={product} compact />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default ProductRail;
