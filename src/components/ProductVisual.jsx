function ProductVisual({ token, height = 280, small = false, fit = 'cover', className = '' }) {
  const imageUrl = token?.imageUrl;
  const alt = token?.alt || token?.label || 'Product image';
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  if (imageUrl) {
    return (
      <div
        className={`product-visual product-visual--image ${fit === 'contain' ? 'product-visual--contain' : ''} ${small ? 'product-visual-sm' : ''} ${className}`.trim()}
        style={{ minHeight: resolvedHeight, height: resolvedHeight }}
      >
        <img className="product-visual__image" src={imageUrl} alt={alt} loading="lazy" style={{ objectFit: fit }} />
      </div>
    );
  }

  const palette = token?.palette || ['#7B1E2B', '#F5E9DC'];
  return (
    <div
      className={`product-visual ${small ? 'product-visual-sm' : ''} ${className}`.trim()}
      style={{
        '--visual-primary': palette[0],
        '--visual-secondary': palette[1],
        minHeight: resolvedHeight,
        height: resolvedHeight,
      }}
    >
      <div className="product-visual__sheet" />
      <div className="product-visual__card">
        <span className="product-visual__label">{token?.label || 'Rent a Fit'}</span>
      </div>
      <div className="product-visual__line product-visual__line--one" />
      <div className="product-visual__line product-visual__line--two" />
    </div>
  );
}

export default ProductVisual;
