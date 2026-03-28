import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/mockData';
import { formatCurrency } from '../utils/formatters';

function SearchModal() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query).slice(0, 6);
  }, [query]);

  const handleSelect = (productId) => {
    setQuery('');
    navigate(`/products/${productId}`);
    const element = document.getElementById('searchModalClose');
    element?.click();
  };

  return (
    <div className="modal fade" id="searchModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 overflow-hidden search-modal">
          <div className="modal-header border-0">
            <div>
              <p className="eyebrow mb-1">Search</p>
              <h5 className="modal-title mb-0">Find your next rental</h5>
            </div>
            <button id="searchModalClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body pt-0">
            <input
              className="form-control form-control-lg search-input mb-3"
              type="text"
              placeholder="Search by product, brand, category..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
            />

            {query.trim() && results.length === 0 && (
              <div className="search-empty">No products matched your search yet.</div>
            )}

            <div className="search-results d-grid gap-2">
              {results.map((product) => (
                <button
                  type="button"
                  className="search-result-item text-start"
                  key={product.id}
                  onClick={() => handleSelect(product.id)}
                >
                  <div className="search-result-item__content">
                    <img className="search-result-item__thumb" src={product.mainImageUrl} alt={product.name} loading="lazy" />
                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <div className="text-muted small">{product.brand} · {product.category} · {product.gender}</div>
                    </div>
                  </div>
                  <div className="fw-semibold">{formatCurrency(product.price)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
