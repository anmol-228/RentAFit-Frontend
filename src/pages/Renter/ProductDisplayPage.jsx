import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import ProductCard from '../../components/ProductCard';
import SiteFooter from '../../components/SiteFooter';
import {
  CATEGORY_OPTIONS,
  CATALOG_GENDER_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  SORT_OPTIONS,
} from '../../data/itemOptions';
import { getProductsByFilters } from '../../services/mockData';

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProductDisplayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = {
    gender: searchParams.get('gender') || 'All',
    category: searchParams.get('category') || 'All',
    search: searchParams.get('search') || '',
    priceBand: searchParams.get('price') || 'All',
    sort: searchParams.get('sort') || 'featured',
  };

  const products = useMemo(
    () => getProductsByFilters(filters),
    [filters.gender, filters.category, filters.search, filters.priceBand, filters.sort],
  );

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="catalog-shell py-5">
        <section className="listing-header catalog-header mb-4">
          <p className="eyebrow mb-2 d-none d-xl-block">Products</p>
          <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-end gap-3">
            <div>
              <h1 className="section-title mb-1">Browse the current rental edit</h1>
              <p className="text-muted mb-0 catalog-header__copy">Filter by gender, category, and price to move through the catalog with less friction.</p>
            </div>
            <div className="result-pill d-none d-xl-inline-flex">{products.length} items found</div>
          </div>
        </section>

        <div className="catalog-mobile-toolbar d-xl-none mb-3">
          <p className="eyebrow mb-0">Products</p>
          <div className="result-pill mb-0 ms-auto">{products.length} items</div>
          <button
            type="button"
            className="catalog-filter-toggle ms-2"
            aria-label="Open filters"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
          >
            <FilterIcon />
          </button>
        </div>

        <div className="catalog-layout">
          <aside className={`filter-panel catalog-filter-panel ${mobileFiltersOpen ? 'is-open' : ''}`}>
            <div className="catalog-filter-panel__header mb-3">
              <h2 className="mb-0 eyebrow">Filters</h2>
              <div className="d-flex align-items-center gap-3">
                <button type="button" className="btn btn-outline-primary rounded-pill px-3 py-1" onClick={clearFilters}>
                  Clear
                </button>
                <button
                  type="button"
                  className="filter-close-btn d-xl-none"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="d-grid gap-3">
              <div>
                <label className="form-label">Gender</label>
                <select className="form-select" value={filters.gender === 'Unisex' ? 'All' : filters.gender} onChange={(event) => updateFilter('gender', event.target.value)}>
                  <option value="All">All</option>
                  {CATALOG_GENDER_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
                  <option value="All">All</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Price range</label>
                <select className="form-select" value={filters.priceBand} onChange={(event) => updateFilter('price', event.target.value)}>
                  {PRICE_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Sort</label>
                <select className="form-select" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="catalog-results">
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-sm-6 col-lg-6 col-xl-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="empty-view mt-4">
                <h3 className="mb-2">No products match these filters.</h3>
                <p className="text-muted mb-0">Clear the filters to return to the full catalog.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default ProductDisplayPage;
